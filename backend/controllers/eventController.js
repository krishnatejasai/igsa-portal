const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { eventInput, validateBookedSettings, bad } = require("../utils/eventRegistration");

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(eventInput(req.body));
    res.status(201).json(event);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });

    const counts = events.length ? await Registration.aggregate([
      { $match: { eventId: { $in: events.map(event => event._id) } } },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]) : [];
    const countByEvent = new Map(counts.map(item => [String(item._id), item.count]));
    const eventsWithCounts = events.map(event => ({
      ...event.toObject(),
      registrationCount: countByEvent.get(String(event._id)) || 0,
    }));

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const counts = await Registration.aggregate([
      { $match: { eventId: event._id, status: 'registered' } },
      { $group: { _id: '$slotId', count: { $sum: 1 } } },
    ]);
    const registeredCount = counts.reduce((sum, row) => sum + row.count, 0);
    const data = event.toObject();
    data.registrationFields ||= { phone: 'required', ufid: 'required', program: 'required' };
    data.remaining = Math.max(0, event.capacity - registeredCount);
    if (data.slotQuestion?.enabled) data.slotQuestion.options = data.slotQuestion.options.map(slot => {
      const booked = counts.find(row => row._id === slot.id)?.count || 0;
      return { ...slot, booked, remaining: Math.max(0, Math.min(slot.capacity - booked, data.remaining)) };
    });
    res.set('Cache-Control', 'no-store');
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const input = eventInput(req.body);
    const updatedEvent = await Event.db.transaction(async session => {
      const event = await Event.findOneAndUpdate({ _id: req.params.id }, { $inc: { bookingVersion: 1 } }, { new: true, session });
      if (!event) bad('Event not found.', 404);
      const registrations = await Registration.find({ eventId: event._id }).select('slotId status').session(session).lean();
      validateBookedSettings(input, registrations);
      event.set(input);
      await event.save({ session });
      return event;
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const toggleRegistrationStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.registrationOpen = event.registrationOpen === false ? true : false;
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  toggleRegistrationStatus,
  deleteEvent,
};