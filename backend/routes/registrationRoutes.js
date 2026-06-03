const express = require("express");

const router = express.Router();

const {
  createRegistration,
  getRegistrations,
  deleteRegistration,
} = require("../controllers/registrationController");

router.get("/", getRegistrations);
router.post("/", createRegistration);
router.delete("/:id", deleteRegistration);

module.exports = router;