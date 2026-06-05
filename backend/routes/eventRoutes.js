const express = require("express");
const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  deleteEvent,
  getEventById,
  updateEvent,
  toggleRegistrationStatus,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getEvents);

router.patch(
  "/:id/toggle-registration",
  protect,
  requireRole("president", "vice-president"),
  toggleRegistrationStatus
);

router.get("/:id", getEventById);

router.post(
  "/",
  protect,
  requireRole("president", "vice-president"),
  createEvent
);

router.put(
  "/:id",
  protect,
  requireRole("president", "vice-president"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  requireRole("president", "vice-president"),
  deleteEvent
);

module.exports = router;