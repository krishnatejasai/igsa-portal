const express = require("express");
const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createRegistration,
  getRegistrations,
  deleteRegistration,
  checkInRegistration,
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", createRegistration);

router.get("/", protect, getRegistrations);

router.post("/check-in", protect, checkInRegistration);

router.delete(
  "/:id",
  protect,
  requireRole("president", "vice-president"),
  deleteRegistration
);

module.exports = router;