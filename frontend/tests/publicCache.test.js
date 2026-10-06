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
