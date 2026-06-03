const Registration = require("../models/Registration");

const createRegistration = async (req, res) => {
  try {
    const registration = await Registration.create(req.body);
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

    await registration.deleteOne();

    res.json({
      message: "Registration deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  deleteRegistration,
};