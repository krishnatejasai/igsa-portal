const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { communityInput, today } = require('../utils/communityValidation');
const Post = require('../models/CommunityPost');
const controller = require('../controllers/communityController');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
const travel = { kind: 'travel', name: 'Student', title: 'Trip to Orlando', email: 'Student@example.com', location: 'Gainesville', destination: 'Orlando', startDate: '2026-10-15', travelMode: 'travel-together', consent: true };
const room = { ...travel, kind: 'roommate', stayType: 'temporary', endDate: '2026-11-01' };
const check = body => communityInput(body, '2026-10-05');

test('travel posts require consent and contact; reject invalid dates and injected values', () => {
  for (const changes of [{ consent: false }, { email: '', phone: '' }, { startDate: '2026-02-30' }, { startDate: '2026-10-04' }, { endDate: '2026-10-14' }, { email: { $gt: '' } }, { phone: 'javascript:alert(1)' }, { travelMode: 'plane' }, { destination: '' }, { details: 'a'.repeat(1201) }]) {
    assert.throws(() => check({ ...travel, ...changes }));
  }
});
test('normalizes contact and discards client status, token and unknown fields', () => {
  const data = check({ ...travel, status: 'hidden', manageTokenHash: 'injected', admin: true });
  assert.equal(data.email, 'student@example.com');
  assert.equal(data.expiresOn, data.startDate);
  assert.equal(data.status, undefined);
  assert.equal(data.manageTokenHash, undefined);
  assert.equal(data.admin, undefined);
});
test('temporary and permanent housing expiry and required end dates', () => {
  assert.equal(check(room).expiresOn, '2026-11-01');
  assert.throws(() => check({ ...room, endDate: '' }));
  assert.equal(check({ ...room, stayType: 'permanent', endDate: '' }).expiresOn, '2026-12-04');
  assert.equal(check({ ...room, endDate: '2027-01-01' }).expiresOn, '2026-12-04');
});
test('phone-only posts work and email-only posts work', () => {
  assert.equal(check({ ...travel, email: '', phone: '+1 (352) 555-0123' }).email, '');
  assert.equal(check(travel).phone, '');
});
test('creation publishes immediately and returns secret only to the creator', async t => {
  t.mock.method(Post, 'countDocuments', async () => 0);
  let saved;
  t.mock.method(Post, 'create', async input => { saved = input; return { _id: 'a'.repeat(24), ...input }; });
  const res = response();
  await controller.create({ body: { ...travel, startDate: today() } }, res);
  assert.equal(res.code, 201);
  assert.equal(saved.status, 'active');
  assert.equal(res.body.manageToken.length, 64);
  assert.equal(saved.manageTokenHash, crypto.createHash('sha256').update(res.body.manageToken).digest('hex'));
  assert.equal(res.body.manageTokenHash, undefined);
  assert.ok(saved.consentAt instanceof Date);
});
test('daily contact posting limit prevents additional writes', async t => {
  t.mock.method(Post, 'countDocuments', async () => 5);
  t.mock.method(Post, 'create', () => assert.fail('must not write'));
  const res = response();
  await controller.create({ body: { ...travel, startDate: today() } }, res);
  assert.equal(res.code, 429);
});
test('public listing hides inactive/expired records, escapes search and paginates without secrets', async t => {
  let selected;
  t.mock.method(Post, 'find', query => {
    assert.equal(query.status, 'active');
    assert.equal(query.expiresOn.$gte, today());
    assert.equal(query.kind, 'travel');
    assert.equal(query.$or[0].title.$regex, 'Orlando\\.\\*');
    assert.deepEqual(query.startDate, { $gte: '2026-10-05', $lte: '2026-10-20' });
    return { select(fields) { selected = fields; return this; }, sort() { return this; }, skip(n) { assert.equal(n, 12); return this; }, limit(n) { assert.equal(n, 13); return this; }, async lean() { return Array.from({ length: 13 }, (_, i) => ({ _id: i })); } };
  });
  const res = response();
  await controller.list({ query: { kind: 'travel', q: 'Orlando.*', page: '2', from: '2026-10-05', to: '2026-10-20' } }, res);
  assert.equal(res.body.items.length, 12);
  assert.equal(res.body.hasMore, true);
  assert.ok(!selected.includes('manageTokenHash'));
  assert.ok(!selected.includes('consentAt'));
});
test('bad date ranges and query objects do not reach database', async t => {
  t.mock.method(Post, 'find', () => assert.fail('invalid query'));
  for (const query of [{ from: 'wrong' }, { from: '2026-10-20', to: '2026-10-05' }, { q: { $gt: '' } }, { kind: 'other' }]) {
    const res = response(); await controller.list({ query }, res); assert.equal(res.code, 400);
  }
});
test('only a matching management token can read or close a listing', async t => {
  const id = 'a'.repeat(24), token = 'b'.repeat(64);
  t.mock.method(Post, 'findOneAndUpdate', (query, update) => {
    assert.equal(query._id, id);
    assert.equal(query.manageTokenHash, crypto.createHash('sha256').update(token).digest('hex'));
    assert.deepEqual(update, { $set: { status: 'closed' } });
    return { select: async () => null };
  });
  let res = response();
  await controller.owner({ params: { id }, body: { token }, path: '/' + id + '/close' }, res);
  assert.equal(res.code, 404);
  res = response();
  await controller.owner({ params: { id }, body: {}, path: '/' + id + '/close' }, res);
  assert.equal(res.code, 404);
});
test('moderation routes enforce authenticated board access', async () => {
  const router = require('../routes/communityRoutes');
  for (const path of ['/admin', '/:id/status']) {
    const route = router.stack.find(layer => layer.route?.path === path).route;
    assert.equal(route.stack[0].handle.name, 'protect');
    const res = response();
    await route.stack[0].handle({ headers: {} }, res, () => assert.fail('must not authorize'));
    assert.equal(res.code, 401);
  }
});
test('moderation validates status and restores only the status field', async t => {
  const id = 'a'.repeat(24);
  t.mock.method(Post, 'findByIdAndUpdate', (actualId, update) => {
    assert.equal(actualId, id);
    assert.deepEqual(update, { $set: { status: 'hidden' } });
    return { select: async () => ({ _id: id, status: 'hidden' }) };
  });
  const res = response();
  await controller.moderate({ params: { id }, body: { status: 'hidden', email: 'not-saved@example.com' } }, res);
  assert.equal(res.body.status, 'hidden');
  const invalid = response();
  await controller.moderate({ params: { id }, body: { status: 'invalid' } }, invalid);
  assert.equal(invalid.code, 400);
});
