import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cachedPublicRequest, clearPublicCache } from '../src/utils/publicCache.js';
test('deduplicates in-flight and recent requests, then refreshes expired content', async () => {
  clearPublicCache();
  let count = 0;
  const request = async () => ++count;
  const first = cachedPublicRequest('events', request);
  assert.equal(await cachedPublicRequest('events', request), await first);
  assert.equal(count, 1);
  assert.equal(await cachedPublicRequest('events', request, Date.now() + 61000), 2);
});
test('failed requests are retryable and mutation invalidation discards old responses', async () => {
  clearPublicCache();
  await assert.rejects(cachedPublicRequest('gallery', async () => { throw new Error('offline'); }));
  assert.equal(await cachedPublicRequest('gallery', async () => 'ok'), 'ok');
  let finish;
  const old = cachedPublicRequest('board', () => new Promise(resolve => { finish = resolve; }));
  clearPublicCache();
  finish('old'); await old;
  assert.equal(await cachedPublicRequest('board', async () => 'new'), 'new');
});

test('community searches normalize query order, stay isolated and expire after 30 seconds', async () => {
  const { getCachedPublicValue } = await import('../src/utils/publicCache.js');
  clearPublicCache();
  let count = 0;
  const request = async () => ({ items: [++count] });
  await cachedPublicRequest('community?kind=roommate&page=1', request);
  assert.deepEqual(getCachedPublicValue('community?page=1&kind=roommate'), { items: [1] });
  await cachedPublicRequest('community?page=1&kind=roommate', request);
  assert.equal(count, 1);
  assert.equal(getCachedPublicValue('community?kind=travel&page=1'), undefined);
  assert.equal(getCachedPublicValue('community?kind=roommate&page=1', Date.now() + 31000), undefined);
  await cachedPublicRequest('community?kind=roommate&page=1', request, Date.now() + 31000);
  assert.equal(count, 2);
  clearPublicCache();
  assert.equal(getCachedPublicValue('community?kind=roommate&page=1'), undefined);
});

test('private management, login, mine, full galleries and admin endpoints are excluded', async () => {
  const { isPublicCachePath } = await import('../src/utils/publicCache.js');
  for (const path of ['community/mine', 'community/session/config', 'community/123/manage', 'community/admin', 'gallery', 'gallery/123', 'auth/login']) assert.equal(isPublicCachePath(path), false);
  for (const path of ['community?kind=travel&page=1', 'events', 'board-members', 'gallery?summary=1']) assert.equal(isPublicCachePath(path), true);
});

test('search cache is bounded instead of retaining all contact results', async () => {
  const { getCachedPublicValue } = await import('../src/utils/publicCache.js');
  clearPublicCache();
  for (let i = 0; i < 45; i++) await cachedPublicRequest(`community?q=${i}`, async () => i);
  assert.equal(getCachedPublicValue('community?q=0'), undefined);
  assert.equal(getCachedPublicValue('community?q=44'), 44);
});
