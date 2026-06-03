const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);

router.post("/", protect, createAnnouncement);
router.put("/:id", protect, updateAnnouncement);
router.delete("/:id", protect, deleteAnnouncement);

module.exports = router;