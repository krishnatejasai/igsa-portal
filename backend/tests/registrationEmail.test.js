const { test } = require('node:test');
const assert = require('node:assert/strict');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { emailFields, buildEmail, processNextEmail } = require('../utils/registrationEmail');
const { createRegistration } = require('../controllers/registrationController');
const event = { _id: 'event-id', title: 'Diwali <night>', date: '2026-11-01', time: '18:00', location: 'Reitz Union', confirmationMessage: 'Welcome!\nBring your ID <script>alert(1)</script>', capacity: 100 };
const registration = () => ({ _id: 'registration-id', name: 'Sai <img>', email: 'student@example.com', qrCode: 'IGSA-test-ticket', ...emailFields(event), emailAttempts: 1 });
function configure(t) {
  const previous = { key: process.env.RESEND_API_KEY, from: process.env.EVENT_EMAIL_FROM };
  process.env.RESEND_API_KEY = 'test-only'; process.env.EVENT_EMAIL_FROM = 'IGSA <events@example.com>';
  t.after(() => { for (const [key, value] of Object.entries({ RESEND_API_KEY: previous.key, EVENT_EMAIL_FROM: previous.from })) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
}
test('email contains escaped custom message, event details and matching PNG attachment', async t => {
  configure(t);
  const email = await buildEmail(registration());
  assert.equal(email.reply_to, 'igsa.uf@gmail.com');
  assert.match(email.text, /2026-11-01.*18:00/);
  assert.match(email.text, /Bring your ID/);
  assert.ok(!email.html.includes('<script>'));
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /cid:igsa-ticket/);
  assert.equal(email.attachments[0].content_id, 'igsa-ticket');
  assert.equal(Buffer.from(email.attachments[0].content, 'base64').subarray(1, 4).toString(), 'PNG');
});
test('worker submits with idempotency, marks provider acceptance and clears snapshot', async t => {
  configure(t); const updates = [];
  t.mock.method(Registration, 'findOneAndUpdate', () => ({ select: async () => registration() }));
  t.mock.method(Registration, 'updateOne', async (_, update) => updates.push(update));
  t.mock.method(global, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers['Idempotency-Key'], 'registration-registration-id');
    assert.deepEqual(JSON.parse(options.body).to, ['student@example.com']);
    return { ok: true };
  });
  await processNextEmail();
  assert.equal(updates.at(-1).$set.emailStatus, 'sent');
  assert.equal(updates.at(-1).$unset.emailSnapshot, 1);
});
test('provider failure schedules retry without changing registration or leaking errors', async t => {
  configure(t); const updates = [];
  t.mock.method(Registration, 'findOneAndUpdate', () => ({ select: async () => registration() }));
  t.mock.method(Registration, 'updateOne', async (_, update) => updates.push(update));
  t.mock.method(global, 'fetch', async () => ({ ok: false }));
  t.mock.method(console, 'error', () => {});
  await processNextEmail();
  assert.equal(updates.at(-1).$set.emailStatus, 'pending');
  assert.ok(updates.at(-1).$set.emailNextAttempt > new Date());
  assert.equal(updates.at(-1).$set.status, undefined);
});
test('expired delivery attempt is not resent outside provider deduplication window', async t => {
  configure(t); let sent = false; const updates = [];
  t.mock.method(Registration, 'findOneAndUpdate', () => ({ select: async () => ({ ...registration(), emailFirstAttempt: new Date(Date.now() - 24 * 3600000) }) }));
  t.mock.method(Registration, 'updateOne', async (_, update) => updates.push(update));
  t.mock.method(global, 'fetch', async () => { sent = true; });
  await processNextEmail();
  assert.equal(sent, false); assert.equal(updates.at(-1).$set.emailStatus, 'failed');
});
test('registration queues email atomically, trusts stored event title and ignores injected fields', async t => {
  configure(t); let saved;
  t.mock.method(Event, 'findById', async () => event);
  t.mock.method(Registration, 'findOne', async () => null);
  t.mock.method(Registration, 'countDocuments', async () => 0);
  t.mock.method(Registration, 'create', async fields => { saved = fields; return { toObject: () => ({ ...fields }) }; });
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await createRegistration({ body: { eventId: 'event-id', name: 'Sai', email: 'Student@example.com', phone: '1234567890', ufid: '12345678', program: 'CS', eventTitle: 'Forged', checkedIn: true, emailStatus: 'sent' } }, res);
  assert.equal(res.code, 201); assert.equal(saved.eventTitle, event.title);
  assert.equal(saved.emailStatus, 'pending'); assert.equal(saved.checkedIn, undefined);
  assert.equal(saved.email, 'student@example.com'); assert.ok(saved.qrCode.startsWith('IGSA-'));
  assert.equal(res.body.emailSnapshot, undefined); assert.equal(res.body.emailDelivery, 'queued');
});
