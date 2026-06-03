const BoardMember = require("../models/BoardMember");

const createBoardMember = async (req, res) => {
  try {
    const member = await BoardMember.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBoardMembers = async (req, res) => {
  try {
    const members = await BoardMember.find().sort({ createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBoardMember = async (req, res) => {
  try {
    const member = await BoardMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Board member not found" });
    }

    await member.deleteOne();

    res.json({ message: "Board member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBoardMember,
  getBoardMembers,
  deleteBoardMember,
};