const { test } = require('node:test');
const assert = require('node:assert/strict');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { createRegistration } = require('../controllers/registrationController');
const event = { _id: 'event-id', title: 'Diwali', capacity: 100 };
test('registration returns an on-screen QR without email jobs and ignores injected fields', async t => {
  let saved;
  t.mock.method(Event, 'findById', async () => event);
  t.mock.method(Registration, 'findOne', async () => null);
  t.mock.method(Registration, 'countDocuments', async () => 0);
  t.mock.method(Registration, 'create', async fields => { saved = fields; return { toObject: () => ({ ...fields }) }; });
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await createRegistration({ body: { eventId: 'event-id', name: 'Sai', email: 'Student@example.com', phone: '1234567890', ufid: '12345678', program: 'CS', eventTitle: 'Forged', checkedIn: true, emailStatus: 'sent' } }, res);
  assert.equal(res.code, 201); assert.equal(saved.eventTitle, event.title);
  assert.equal(saved.emailStatus, undefined); assert.equal(saved.checkedIn, undefined);
  assert.equal(saved.email, 'student@example.com'); assert.ok(saved.qrCode.startsWith('IGSA-'));
  assert.equal(res.body.emailSnapshot, undefined); assert.equal(res.body.emailDelivery, undefined);
});
