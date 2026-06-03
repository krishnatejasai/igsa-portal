const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createBoardMember,
  getBoardMembers,
  deleteBoardMember,
} = require("../controllers/boardMemberController");

router.get("/", getBoardMembers);

router.post("/", protect, createBoardMember);
router.delete("/:id", protect, deleteBoardMember);

module.exports = router;