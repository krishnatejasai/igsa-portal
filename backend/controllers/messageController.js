const Message = require("../models/Message");

const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    if (req.admin.role !== "president" && req.admin.role !== "admin") {
      return res.status(403).json({
        message: "Only the President can delete messages.",
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};