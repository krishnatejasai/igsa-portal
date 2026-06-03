const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createRegistration,
  getRegistrations,
  deleteRegistration,
} = require("../controllers/registrationController");

router.post("/", createRegistration);

router.get("/", protect, getRegistrations);
router.delete("/:id", protect, deleteRegistration);

module.exports = router;