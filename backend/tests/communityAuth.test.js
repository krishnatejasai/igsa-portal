const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/communityAuth');
const config = require('../config/community');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, set() { return this; }, json(body) { this.body = body; return this; } });
const options = { audience: 'igsa-community', issuer: 'igsa-portal' };
test('Google ID verification binds audience and challenge, then issues isolated student session', async t => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'local-tests-only-not-a-production-secret';
  t.after(() => { if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret; });
  const challenge = response(); auth.challenge({}, challenge);
  const nonce = challenge.body.nonce;
  t.mock.method(auth.google, 'verifyIdToken', async input => {
    assert.equal(input.audience, config.googleClientId);
    assert.equal(input.idToken, 'signed-google-id-token');
    return { getPayload: () => ({ sub: 'google-123', email: 'student@example.com', email_verified: true, name: 'Student', nonce }) };
  });
  const res = response();
  await auth.login({ body: { credential: 'signed-google-id-token', nonce } }, res);
  assert.equal(res.code, 200);
  const payload = jwt.verify(res.body.token, process.env.JWT_SECRET, options);
  assert.equal(payload.sub, 'google-123');
  assert.equal(payload.purpose, 'community-session');
  assert.equal(payload.id, undefined);
  const req = { headers: { authorization: 'Bearer ' + res.body.token } };
  let passed = false; auth.requireMember(req, response(), () => { passed = true; });
  assert.equal(passed, true); assert.equal(req.member.sub, 'google-123');
});
test('forged, expired, admin and nonce tokens cannot become community sessions', t => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'local-tests-only-not-a-production-secret';
  t.after(() => { if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret; });
  const values = [
    'forged',
    jwt.sign({ id: 'admin' }, process.env.JWT_SECRET),
    jwt.sign({ sub: 'a', purpose: 'community-nonce' }, process.env.JWT_SECRET, options),
    jwt.sign({ sub: 'a', purpose: 'community-session' }, process.env.JWT_SECRET, { ...options, expiresIn: -1 }),
  ];
  for (const token of values) {
    const res = response();
    auth.requireMember({ headers: { authorization: 'Bearer ' + token } }, res, () => assert.fail('must reject'));
    assert.equal(res.code, 401);
  }
});
test('Google nonce mismatch, unverified email, and invalid signature are rejected', async t => {
  const originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'local-tests-only-not-a-production-secret';
  t.after(() => { if (originalSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = originalSecret; });
  const challenge = response(); auth.challenge({}, challenge);
  const nonce = challenge.body.nonce;
  let payload = { sub: 'a', nonce: 'wrong', email_verified: true };
  const verify = t.mock.method(auth.google, 'verifyIdToken', async () => ({ getPayload: () => payload }));
  let res = response(); await auth.login({ body: { credential: 'id-token', nonce } }, res); assert.equal(res.code, 401);
  payload = { sub: 'a', nonce, email_verified: false };
  res = response(); await auth.login({ body: { credential: 'id-token', nonce } }, res); assert.equal(res.code, 401);
  verify.mock.mockImplementation(async () => { throw new Error('signature invalid'); });
  res = response(); await auth.login({ body: { credential: 'id-token', nonce } }, res); assert.equal(res.code, 401);
});
test('guest access is optional only on guest-capable endpoints', () => {
  let passed = false; auth.optionalMember({ headers: {} }, response(), () => { passed = true; }); assert.equal(passed, true);
  const res = response(); auth.requireMember({ headers: {} }, res, () => assert.fail()); assert.equal(res.code, 401);
});
