// Free, isolated replica-set test. Install mongodb-memory-server in a temporary
// folder and set IGSA_MEMORY_SERVER_MODULE to its module path before running.
const { MongoMemoryReplSet } = require(process.env.IGSA_MEMORY_SERVER_MODULE || 'mongodb-memory-server');
const mongoose = require('mongoose');
const assert = require('node:assert/strict');
const Event = require('../../models/Event');
const Registration = require('../../models/Registration');
const { createRegistration, deleteRegistration } = require('../../controllers/registrationController');
const { getEventById, updateEvent } = require('../../controllers/eventController');
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, set() { return this; }, json(body) { this.body = body; return this; } });
async function run() {
  const db = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  try {
    await mongoose.connect(db.getUri());
    await Promise.all([Event.init(), Registration.init()]);
    const event = await Event.create({ title: 'Isolated shuttle test', category: 'Transport', date: '2026-12-01', time: '17:00', capacity: 4, location: 'Campus', description: 'Test', registrationLink: '', registrationFields: { phone: 'hidden', ufid: 'optional', program: 'hidden' }, slotQuestion: { enabled: true, label: 'Which shuttle?', options: [{ id: 'early', label: '5 PM', capacity: 2 }, { id: 'late', label: '6 PM', capacity: 2 }] } });
    const book = async (number, slotId = 'early') => {
      const res = response();
      await createRegistration({ body: { eventId: String(event._id), name: 'Test', email: `test${number}@example.com`, slotId } }, res);
      return res;
    };
    const simultaneous = await Promise.all(Array.from({ length: 8 }, (_, i) => book(i)));
    assert.equal(simultaneous.filter(res => res.code === 201).length, 2);
    assert.equal(simultaneous.filter(res => res.code === 409).length, 6);
    assert.equal(await Registration.countDocuments({ slotId: 'early' }), 2);
    assert.equal((await book(80, 'bogus')).code, 400);
    const duplicate = response();
    await createRegistration({ body: { eventId: String(event._id), name: 'Test', email: simultaneous.find(res => res.code === 201).body.email, slotId: 'late' } }, duplicate);
    assert.equal(duplicate.code, 409);
    assert.equal((await book(81, 'late')).code, 201);
    assert.equal((await book(82, 'late')).code, 201);
    assert.equal((await book(83, 'late')).code, 409);
    const availability = response();
    await getEventById({ params: { id: String(event._id) } }, availability);
    assert.equal(availability.body.remaining, 0);
    assert.ok(availability.body.slotQuestion.options.every(slot => slot.remaining === 0));
    const edit = response();
    await updateEvent({ params: { id: String(event._id) }, body: { ...event.toObject(), capacity: 1 } }, edit);
    assert.equal(edit.code, 400);
    const removeSlot = response();
    await updateEvent({ params: { id: String(event._id) }, body: { ...event.toObject(), slotQuestion: { enabled: false } } }, removeSlot);
    assert.equal(removeSlot.code, 400);
    const booked = await Registration.findOne({ slotId: 'early' });
    const deleted = response();
    await deleteRegistration({ params: { id: String(booked._id) } }, deleted);
    assert.equal(deleted.code, 200);
    assert.equal((await book(84)).code, 201);
    assert.equal(await Registration.countDocuments(), 4);
    const final = response();
    await getEventById({ params: { id: String(event._id) } }, final);
    assert.equal(final.body.slotQuestion.options[0].booked, 2);
    console.log('PASS: concurrent last-seat bookings, optional UFIDs, duplicates, slot validation, full availability, protected edits, deletion and rebooking.');
  } finally {
    await mongoose.disconnect();
    await db.stop();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
