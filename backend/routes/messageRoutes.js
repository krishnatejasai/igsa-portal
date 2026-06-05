const express = require("express");
const { protect, requireRole } = require("../middleware/authMiddleware");

const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);

router.get("/", protect, getMessages);

router.delete("/:id", protect, requireRole("president"), deleteMessage);

module.exports = router;