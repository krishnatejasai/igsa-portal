const { test } = require('node:test');
const assert = require('node:assert/strict');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { createRegistration } = require('../controllers/registrationController');
const { settings, studentInput, validateBookedSettings } = require('../utils/eventRegistration');
const event = { _id: 'event-id', title: 'Diwali', capacity: 100 };
const query = value => ({ session: async () => value });
test('registration returns QR and trusts stored settings rather than supplied status or title', async t => {
  let saved;
  t.mock.method(Event.db, 'transaction', async callback => callback({}));
  t.mock.method(Event, 'findOneAndUpdate', async () => event);
  t.mock.method(Registration, 'findOne', () => query(null));
  t.mock.method(Registration, 'countDocuments', () => query(0));
  t.mock.method(Registration, 'create', async fields => { saved = fields[0]; return fields; });
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await createRegistration({ body: { eventId: 'event-id', name: 'Sai', email: 'Student@example.com', phone: '1234567890', ufid: '12345678', program: 'CS', eventTitle: 'Forged', checkedIn: true, emailStatus: 'sent' } }, res);
  assert.equal(res.code, 201); assert.equal(saved.eventTitle, event.title);
  assert.equal(saved.emailStatus, undefined); assert.equal(saved.checkedIn, undefined);
  assert.equal(saved.email, 'student@example.com'); assert.ok(saved.qrCode.startsWith('IGSA-'));
});
test('optional and hidden fields permit blank UFIDs without matching other blank UFIDs', async t => {
  const configured = { ...event, registrationFields: { ufid: 'optional', phone: 'hidden', program: 'optional' } };
  t.mock.method(Event.db, 'transaction', async callback => callback({}));
  t.mock.method(Event, 'findOneAndUpdate', async () => configured);
  t.mock.method(Registration, 'findOne', filter => { assert.deepEqual(filter.$or, [{ email: 'sai@example.com' }]); return query(null); });
  t.mock.method(Registration, 'countDocuments', () => query(0));
  t.mock.method(Registration, 'create', async fields => fields);
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await createRegistration({ body: { eventId: 'event-id', name: 'Sai', email: 'sai@example.com', phone: 'ignored' } }, res);
  assert.equal(res.code, 201); assert.equal(res.body.phone, ''); assert.equal(res.body.ufid, '');
});
test('settings validate capacities, question text, IDs and duplicate slot labels', () => {
  const input = { slotQuestion: { enabled: true, label: 'Shuttle?', options: [{ id: 'a', label: '5 PM', capacity: 2 }] } };
  assert.equal(settings(input).slotQuestion.options[0].capacity, 2);
  for (const capacity of [0, -1, 1.5, 'abc']) assert.throws(() => settings({ slotQuestion: { ...input.slotQuestion, options: [{ label: '5 PM', capacity }] } }));
  assert.throws(() => settings({ slotQuestion: { ...input.slotQuestion, options: [...input.slotQuestion.options, ...input.slotQuestion.options] } }));
  assert.throws(() => studentInput({ name: 'Sai', email: 'sai@example.com' }, event));
});
test('booked slots cannot be removed or reduced below bookings', () => {
  const input = { capacity: 10, ...settings({ slotQuestion: { enabled: true, label: 'Shuttle?', options: [{ id: 'a', label: '5 PM', capacity: 2 }] } }) };
  const rows = [{ status: 'registered', slotId: 'a' }, { status: 'registered', slotId: 'a' }];
  validateBookedSettings(input, rows);
  assert.throws(() => validateBookedSettings({ ...input, slotQuestion: { enabled: false, options: [] } }, rows));
  input.slotQuestion.options[0].capacity = 1;
  assert.throws(() => validateBookedSettings(input, rows));
});
