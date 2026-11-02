const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { randomUUID } = require("node:crypto");

const generateQrCode = () => {
  return `IGSA-${randomUUID()}`;
};

const { bad, studentInput } = require('../utils/eventRegistration');
// A write to the event serializes all bookings for it across server instances.
// MongoDB retries conflicting transactions, so two students cannot take the last seat.
const lockEvent = (id, session) => Event.findOneAndUpdate(
  { _id: id }, { $inc: { bookingVersion: 1 } }, { new: true, session }
);
const createRegistration = async (req, res) => {
  try {
    const registration = await Event.db.transaction(async session => {
      const event = await lockEvent(req.body.eventId, session);
      if (!event) bad('Event not found.', 404);
      const student = studentInput(req.body, event);
      if (event.registrationOpen === false) bad('Registrations for this event are closed.', 409);
      const contacts = [{ email: student.email }];
      if (student.ufid) contacts.push({ ufid: student.ufid });
      if (await Registration.findOne({ eventId: event._id, $or: contacts }).session(session)) bad('You have already registered for this event.', 409);
      const count = await Registration.countDocuments({ eventId: event._id, status: 'registered' }).session(session);
      if (count >= event.capacity) bad('This event is full.', 409);
      if (student.slotId) {
        const slot = event.slotQuestion.options.find(option => option.id === student.slotId);
        const booked = await Registration.countDocuments({ eventId: event._id, status: 'registered', slotId: slot.id }).session(session);
        if (booked >= slot.capacity) bad('That time slot is full. Please select another slot.', 409);
      }
      const [created] = await Registration.create([{
        ...student, eventId: event._id, eventTitle: event.title,
        qrCode: generateQrCode(), status: 'registered',
      }], { session });
      return created;
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(error.status || (error.name === 'CastError' ? 400 : 500)).json({ message: error.status ? error.message : 'Unable to register. Please try again.' });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({
      createdAt: -1,
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const promotedStudent = await Event.db.transaction(async session => {
      const registration = await Registration.findById(req.params.id).session(session);
      if (!registration) bad('Registration not found.', 404);
      const event = await lockEvent(registration.eventId, session);
      await Registration.deleteOne({ _id: registration._id }, { session });
      if (!event || event.slotQuestion?.enabled || registration.status !== 'registered') return null;
      // Preserve legacy waitlists for ordinary events; shuttle bookings never waitlist.
      const count = await Registration.countDocuments({ eventId: event._id, status: 'registered' }).session(session);
      if (count >= event.capacity) return null;
      const next = await Registration.findOne({ eventId: event._id, status: 'waitlisted' }).sort({ waitlistPosition: 1, createdAt: 1 }).session(session);
      if (!next) return null;
      next.status = 'registered'; next.waitlistPosition = null; next.promotedAt = new Date();
      next.qrCode ||= generateQrCode();
      await next.save({ session });
      return next;
    });
    res.json({ message: 'Registration deleted successfully', promotedStudent });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to delete registration.' });
  }
};

const checkInRegistration = async (req, res) => {
  try {
    const { qrCode } = req.body;

    const registration = await Registration.findOne({ qrCode });

    if (!registration) {
      return res.status(404).json({
        message: "Invalid QR code. Registration not found.",
      });
    }

    if (registration.status !== "registered") {
      return res.status(400).json({
        message: "This student is waitlisted and cannot be checked in yet.",
        registration,
      });
    }

    if (registration.checkedIn) {
      return res.status(400).json({
        message: "Student already checked in.",
        registration,
      });
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();

    await registration.save();

    res.json({
      message: "Attendance marked successfully.",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  deleteRegistration,
  checkInRegistration,
};
