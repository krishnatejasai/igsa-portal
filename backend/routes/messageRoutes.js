const express = require("express");

const router = express.Router();

const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.get("/", getMessages);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);

module.exports = router;