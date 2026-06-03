const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.post("/", createMessage);

router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);

module.exports = router;