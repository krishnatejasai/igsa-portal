const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/community');
const google = new OAuth2Client();
const sessionOptions = { audience: 'igsa-community', issuer: 'igsa-portal' };
function optionalMember(req, res, next) {
  const value = req.headers.authorization;
  if (!value) return next();
  try {
    const payload = jwt.verify(value.replace(/^Bearer /, ''), process.env.JWT_SECRET, { ...sessionOptions, algorithms: ['HS256'] });
    if (payload.purpose !== 'community-session' || typeof payload.sub !== 'string') throw new Error();
    req.member = payload;
    next();
  } catch { res.status(401).json({ message: 'Your student session expired. Please sign in again.' }); }
}
function requireMember(req, res, next) {
  optionalMember(req, res, () => req.member ? next() : res.status(401).json({ message: 'Please sign in with Google.' }));
}
function configuration(req, res) {
  res.json({ clientId: config.googleClientId });
}
function challenge(req, res) {
  if (!config.googleClientId) return res.status(503).json({ message: 'Google sign-in setup is not complete yet. Your private management link still works.' });
  const nonce = jwt.sign({ purpose: 'community-nonce', random: require('node:crypto').randomBytes(24).toString('hex') }, process.env.JWT_SECRET, { ...sessionOptions, expiresIn: '5m', algorithm: 'HS256' });
  res.set('Cache-Control', 'no-store').json({ nonce });
}
async function login(req, res) {
  if (!config.googleClientId) return res.status(503).json({ message: 'Google sign-in setup is not complete yet.' });
  if (typeof req.body.credential !== 'string' || req.body.credential.length > 12000 || typeof req.body.nonce !== 'string') return res.status(400).json({ message: 'Invalid Google sign-in response.' });
  try {
    const challenge = jwt.verify(req.body.nonce, process.env.JWT_SECRET, { ...sessionOptions, algorithms: ['HS256'] });
    if (challenge.purpose !== 'community-nonce') throw new Error();
    const ticket = await google.verifyIdToken({ idToken: req.body.credential, audience: config.googleClientId });
    const payload = ticket.getPayload();
    if (!payload.sub || payload.nonce !== req.body.nonce || !payload.email_verified) throw new Error();
    const user = { sub: payload.sub, name: payload.name || '', email: payload.email };
    const token = jwt.sign({ ...user, purpose: 'community-session' }, process.env.JWT_SECRET, { ...sessionOptions, expiresIn: '7d', algorithm: 'HS256' });
    res.set('Cache-Control', 'no-store').json({ token, user });
  } catch { res.status(401).json({ message: 'Google sign-in could not be verified. Please try again.' }); }
}
module.exports = { optionalMember, requireMember, configuration, challenge, login, google };
