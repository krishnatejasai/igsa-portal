const Registration = require("../models/Registration");
const Event = require("../models/Event");

const generateQrCode = () => {
  return `IGSA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const promoteNextWaitlistedStudent = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) return null;

  const registeredCount = await Registration.countDocuments({
    eventId,
    status: "registered",
  });

  if (registeredCount >= event.capacity) {
    return null;
  }

  const nextWaitlisted = await Registration.findOne({
    eventId,
    status: "waitlisted",
  }).sort({ waitlistPosition: 1, createdAt: 1 });

  if (!nextWaitlisted) {
    return null;
  }

  nextWaitlisted.status = "registered";
  nextWaitlisted.waitlistPosition = null;
  nextWaitlisted.promotedAt = new Date();

  if (!nextWaitlisted.qrCode) {
    nextWaitlisted.qrCode = generateQrCode();
  }

  await nextWaitlisted.save();

  const newRegisteredCount = await Registration.countDocuments({
    eventId,
    status: "registered",
  });

  if (newRegisteredCount >= event.capacity) {
    event.registrationOpen = false;
    await event.save();
  }

  return nextWaitlisted;
};

const createRegistration = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const normalizedUfid = req.body.ufid?.trim();

    const event = await Event.findById(req.body.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const existingRegistration = await Registration.findOne({
      eventId: req.body.eventId,
      $or: [{ email: normalizedEmail }, { ufid: normalizedUfid }],
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You have already registered for this event.",
      });
    }

    if (event.registrationOpen === false) {
      return res.status(400).json({
        message: "Registrations for this event are closed.",
      });
    }

    const registeredCount = await Registration.countDocuments({
      eventId: req.body.eventId,
      status: "registered",
    });

    if (registeredCount >= event.capacity) {
      const waitlistCount = await Registration.countDocuments({
        eventId: req.body.eventId,
        status: "waitlisted",
      });

      const waitlistedRegistration = await Registration.create({
        ...req.body,
        email: normalizedEmail,
        ufid: normalizedUfid,
        status: "waitlisted",
        waitlistPosition: waitlistCount + 1,
      });

      event.registrationOpen = false;
      await event.save();

      return res.status(201).json({
        ...waitlistedRegistration.toObject(),
        waitlisted: true,
        message:
          "Event capacity is full. You have been added to the waitlist.",
      });
    }

    const registration = await Registration.create({
      ...req.body,
      email: normalizedEmail,
      ufid: normalizedUfid,
      qrCode: generateQrCode(),
      status: "registered",
    });

    if (registeredCount + 1 >= event.capacity) {
      event.registrationOpen = false;
      await event.save();
    }

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    const eventId = registration.eventId;
    const wasRegistered = registration.status === "registered";

    await registration.deleteOne();

    let promotedStudent = null;

    if (wasRegistered) {
      promotedStudent = await promoteNextWaitlistedStudent(eventId);
    }

    res.json({
      message: "Registration deleted successfully",
      promotedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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