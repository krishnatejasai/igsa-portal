const express = require("express");

const router = express.Router();

const {
  createEvent,
  getEvents,
  deleteEvent,
  getEventById,
  updateEvent,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;