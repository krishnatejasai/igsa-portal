const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { communityInput, today, fiveMonthsAfter } = require('../utils/communityValidation');
const Post = require('../models/CommunityPost');
const controller = require('../controllers/communityController');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
const travel = { kind: 'travel', name: 'Student', title: 'Trip to Orlando', email: 'Student@example.com', location: 'Gainesville', destination: 'Orlando', startDate: '2026-10-15', travelMode: 'travel-together', consent: true };
const room = { ...travel, kind: 'roommate', stayType: 'temporary', endDate: '2026-11-01' };
const check = body => communityInput(body, '2026-10-05');

test('travel posts require consent and contact; reject invalid dates and injected values', () => {
  for (const changes of [{ consent: false }, { email: '', phone: '' }, { startDate: '2026-02-30' }, { startDate: '2026-10-04' }, { email: { $gt: '' } }, { phone: 'javascript:alert(1)' }, { travelMode: 'plane' }, { destination: '' }, { details: 'a'.repeat(1201) }]) {
    assert.throws(() => check({ ...travel, ...changes }));
  }
});
test('normalizes contact and discards client status, token and unknown fields', () => {
  const data = check({ ...travel, status: 'hidden', manageTokenHash: 'injected', admin: true });
  assert.equal(data.email, 'student@example.com');
  assert.equal(data.expiresOn, '2027-03-05');
  assert.equal(data.status, undefined);
  assert.equal(data.manageTokenHash, undefined);
  assert.equal(data.admin, undefined);
});
test('all listings last five months and stay end is optional', () => {
  assert.equal(check(room).expiresOn, '2027-03-05');
  assert.equal(check({ ...room, endDate: '' }).endDate, '');
  assert.equal(check({ ...room, stayType: 'permanent', endDate: '' }).expiresOn, '2027-03-05');
  assert.equal(check({ ...room, endDate: '2027-01-01' }).expiresOn, '2027-03-05');
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
    assert.equal(query.$or[0].name.$regex, 'Orlando\\.\\*');
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
  t.mock.method(Post, 'findOne', query => {
    assert.equal(query._id, id);
    assert.equal(query.$or[0].manageTokenHash, crypto.createHash('sha256').update(token).digest('hex'));
    return { select: async () => null };
  });
  t.mock.method(Post, 'findOneAndUpdate', () => assert.fail('must not modify'));
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

test('five-month retention clamps month ends and preserves leap days', () => {
  assert.equal(fiveMonthsAfter('2026-09-30'), '2027-02-28');
  assert.equal(fiveMonthsAfter('2027-09-30'), '2028-02-29');
  assert.equal(fiveMonthsAfter('2026-10-05'), '2027-03-05');
});
test('gender and apartment are optional, bounded, and persisted without a title field', () => {
  const { title, ...body } = room;
  const data = check({ ...body, gender: 'Woman', apartment: 'Sunrise, #123' });
  assert.equal(data.gender, 'Woman');
  assert.equal(data.apartment, 'Sunrise, #123');
  assert.equal(data.title, 'Student · Gainesville');
  assert.throws(() => check({ ...body, gender: 'Self-describe' }));
});
test('travel search matches distinct cities and one exact departure date', async t => {
  t.mock.method(Post, 'find', query => {
    assert.deepEqual(query.location, { $regex: 'Gainesville', $options: 'i' });
    assert.deepEqual(query.destination, { $regex: 'Tampa', $options: 'i' });
    assert.equal(query.endDate, undefined);
    assert.equal(query.startDate, '2026-10-20');
    return { select() { return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, lean: async () => [] };
  });
  const res = response();
  await controller.list({ query: { kind: 'travel', origin: 'Gainesville', destination: 'Tampa', date: '2026-10-20' } }, res);
  assert.equal(res.code, 200);
});
test('owner edit preserves ownership, moderation, expiry and original past date', async t => {
  const id = 'a'.repeat(24);
  t.mock.method(Post, 'findOne', query => {
    assert.deepEqual(query.$or, [{ ownerSub: 'owner-a' }]);
    return { select: async () => ({ kind: 'roommate', startDate: '2020-01-01' }) };
  });
  t.mock.method(Post, 'findOneAndUpdate', (query, update) => {
    for (const field of ['ownerSub', 'status', 'manageTokenHash', 'expiresOn', 'retentionVersion']) assert.equal(update.$set[field], undefined);
    assert.equal(update.$set.apartment, '#10');
    return { select: async () => update.$set };
  });
  const res = response();
  await controller.owner({ params: { id }, member: { sub: 'owner-a' }, path: '/' + id + '/edit', body: { ...room, kind: 'travel', startDate: '2020-01-01', endDate: '', apartment: '#10', status: 'active', ownerSub: 'attacker' } }, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.kind, 'roommate');
});
test('owner deletion uses authorization scope; invalid users cannot delete', async t => {
  let found = false;
  t.mock.method(Post, 'findOne', () => ({ select: async () => found ? { name: 'Owner' } : null }));
  const deleted = t.mock.method(Post, 'deleteOne', async query => { assert.deepEqual(query.$or, [{ ownerSub: 'owner' }]); return { deletedCount: 1 }; });
  const req = { params: { id: 'a'.repeat(24) }, member: { sub: 'owner' }, body: {}, path: '/id/delete' };
  const denied = response(); await controller.owner(req, denied); assert.equal(denied.code, 404); assert.equal(deleted.mock.callCount(), 0);
  found = true;
  const success = response(); await controller.owner(req, success); assert.deepEqual(success.body, { deleted: true });
});
test('private link claim never transfers another Google account’s post', async t => {
  t.mock.method(Post, 'findOne', () => ({ select: async () => ({ name: 'Owner' }) }));
  t.mock.method(Post, 'findOneAndUpdate', query => {
    assert.deepEqual(query.$and, [{ $or: [{ ownerSub: { $exists: false } }, { ownerSub: 'new-owner' }] }]);
    return { select: async () => null };
  });
  const res = response();
  await controller.owner({ params: { id: 'a'.repeat(24) }, member: { sub: 'new-owner' }, body: { token: 'b'.repeat(64) }, path: '/id/claim' }, res);
  assert.equal(res.code, 409);
});
test('My listings always scopes queries to the verified Google subject', async t => {
  t.mock.method(Post, 'find', query => {
    assert.deepEqual(query, { ownerSub: 'verified-sub' });
    return { select() { return this; }, sort() { return this; }, skip() { return this; }, limit() { return this; }, lean: async () => [] };
  });
  const res = response();
  await controller.mine({ member: { sub: 'verified-sub' }, query: { ownerSub: 'someone-else' } }, res);
  assert.equal(res.code, 200);
});
test('legacy retention migration extends dates without reopening or rewriting post content', async t => {
  const record = { _id: 'legacy', createdAt: new Date('2026-10-05T14:00:00Z') };
  t.mock.method(Post, 'find', query => {
    assert.deepEqual(query, { retentionVersion: { $ne: 2 } });
    return { select() { return this; }, lean() { return this; }, cursor: async function* () { yield record; } };
  });
  t.mock.method(Post, 'updateOne', async (query, update, options) => {
    assert.deepEqual(query, { _id: 'legacy', retentionVersion: { $ne: 2 } });
    assert.deepEqual(update, { $set: { expiresOn: '2027-03-05', retentionVersion: 2 } });
    assert.equal(options.timestamps, false);
  });
  await require('../utils/communityRetention')();
});

test('travel posts use only departure date; roommate stay ends remains optional and validated', () => {
  assert.equal(check({ ...travel, endDate: '2020-01-01' }).endDate, '');
  assert.equal(check({ ...room, endDate: '' }).endDate, '');
  assert.throws(() => check({ ...room, endDate: '2026-10-14' }), /stay end/);
});
test('board deletion requires authentication and removes an exact ID for either listing kind', async t => {
  const router = require('../routes/communityRoutes');
  const route = router.stack.find(layer => layer.route?.path === '/admin/:id').route;
  assert.equal(route.stack[0].handle.name, 'protect');
  const denied = response();
  await route.stack[0].handle({ headers: {} }, denied, () => assert.fail('anonymous must not delete'));
  assert.equal(denied.code, 401);
  const id = 'a'.repeat(24);
  let kind = 'roommate';
  t.mock.method(Post, 'findByIdAndDelete', async actualId => { assert.equal(actualId, id); return { _id: id, kind }; });
  for (kind of ['roommate', 'travel']) {
    const res = response();
    await controller.adminDelete({ params: { id } }, res);
    assert.deepEqual(res.body, { deleted: true });
  }
});
test('board deletion rejects invalid IDs and reports missing listings', async t => {
  const remove = t.mock.method(Post, 'findByIdAndDelete', async () => null);
  const invalid = response(); await controller.adminDelete({ params: { id: 'bad' } }, invalid);
  assert.equal(invalid.code, 400); assert.equal(remove.mock.callCount(), 0);
  const missing = response(); await controller.adminDelete({ params: { id: 'a'.repeat(24) } }, missing);
  assert.equal(missing.code, 404);
});
