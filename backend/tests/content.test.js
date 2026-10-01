const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boardInput, galleryInput } = require('../utils/contentValidation');
const { requireRole } = require('../middleware/authMiddleware');
const BoardMember = require('../models/BoardMember');
const Gallery = require('../models/Gallery');
const board = require('../controllers/boardMemberController');
const gallery = require('../controllers/galleryController');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });

test('link-only gallery album requires no stored photos', () => {
  assert.deepEqual(galleryInput({ album: ' Diwali ', externalUrl: 'https://drive.google.com/drive/folders/example' }), { album: 'Diwali', description: '', externalUrl: 'https://drive.google.com/drive/folders/example', photos: [] });
});
test('gallery rejects empty content, unsafe URLs, wrong types and excessive photos', () => {
  for (const input of [{ album: 'Event' }, { album: 'Event', externalUrl: 'javascript:alert(1)' }, { album: 'Event', externalUrl: {} }, { album: 'Event', photos: 'bad' }, { album: 'Event', photos: Array(21).fill('https://example.com/photo.jpg') }, { album: 'Event', photos: ['data:image/svg+xml;base64,abc='] }, { album: 'Event', externalUrl: 'https://user:password@example.com' }]) assert.throws(() => galleryInput(input));
});
test('gallery accepts highlights and a full album link together', () => {
  assert.equal(galleryInput({ album: 'Event', photos: ['data:image/jpeg;base64,YQ=='], externalUrl: 'https://photos.app.goo.gl/example' }).photos.length, 1);
});
test('gallery bounds database payload size', () => {
  assert.throws(() => galleryInput({ album: 'Event', photos: ['data:image/jpeg;base64,' + 'A'.repeat(8000001)] }), /too large/);
});
test('board profiles trim fields and discard unrecognized input', () => {
  assert.deepEqual(boardInput({ name: ' Member ', position: ' President ', role: 'president' }), { name: 'Member', position: 'President', email: '', description: '', image: '', displayOrder: 1000 });
  assert.throws(() => boardInput({ name: ' ', position: 'President' }));
  assert.throws(() => boardInput({ name: 'Member', position: 'President', email: 'invalid' }));
  assert.throws(() => boardInput({ name: 'Member', position: 'President', image: 'javascript:bad' }));
});
test('role guard denies anonymous and unauthorized members', () => {
  const middleware = requireRole('president', 'vice-president');
  for (const [admin, expected] of [[undefined, 401], [{ role: 'board-member' }, 403]]) {
    const res = response(); middleware({ admin }, res, () => assert.fail('must not authorize')); assert.equal(res.code, expected);
  }
  let allowed = false;
  middleware({ admin: { role: 'president' } }, response(), () => { allowed = true; });
  assert.equal(allowed, true);
});
test('board update validates input, saves allowed fields and reports missing records', async t => {
  t.mock.method(BoardMember, 'findByIdAndUpdate', async (id, input, options) => {
    assert.equal(id, 'member-id'); assert.equal(input.name, 'Updated member'); assert.equal(options.runValidators, true); return null;
  });
  const res = response();
  await board.updateBoardMember({ params: { id: 'member-id' }, body: { name: 'Updated member', position: 'President' } }, res);
  assert.equal(res.code, 404);
});
test('album creation persists external link without requiring photos', async t => {
  t.mock.method(Gallery, 'create', async input => ({ _id: 'album-id', ...input }));
  const res = response();
  await gallery.createAlbum({ body: { album: 'Event', externalUrl: 'https://drive.google.com/drive/folders/example' } }, res);
  assert.equal(res.code, 201); assert.deepEqual(res.body.photos, []); assert.ok(res.body.externalUrl);
});
test('malformed album update is rejected before database access', async t => {
  t.mock.method(Gallery, 'findByIdAndUpdate', () => assert.fail('must not access database'));
  const res = response(); await gallery.updateAlbum({ params: { id: 'id' }, body: { album: 'Event', externalUrl: 'http://example.com' } }, res);
  assert.equal(res.code, 400);
});

test('board display order accepts integers and rejects invalid ordering input', () => {
  assert.equal(boardInput({ name: 'Member', position: 'President', displayOrder: 10 }).displayOrder, 10);
  for (const displayOrder of [-1, 1.5, 10001, '10', null]) assert.throws(() => boardInput({ name: 'Member', position: 'President', displayOrder }));
});

test('board list sorts numeric display order while preserving legacy tie order', async t => {
  t.mock.method(BoardMember, 'find', () => ({ sort: async () => [
    { name: 'Legacy first' }, { name: 'Second', displayOrder: 20 },
    { name: 'First', displayOrder: 10 }, { name: 'Legacy next', displayOrder: 1000 },
  ] }));
  const res = response(); await board.getBoardMembers({}, res);
  assert.deepEqual(res.body.map(item => item.name), ['First', 'Second', 'Legacy first', 'Legacy next']);
});
