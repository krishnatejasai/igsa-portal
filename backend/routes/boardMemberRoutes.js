const express = require("express");

const router = express.Router();

const {
  createBoardMember,
  getBoardMembers,
  deleteBoardMember,
} = require("../controllers/boardMemberController");

router.get("/", getBoardMembers);
router.post("/", createBoardMember);
router.delete("/:id", deleteBoardMember);

module.exports = router;