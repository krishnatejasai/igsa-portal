const express = require("express");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

router.get("/", getAnnouncements);
router.post("/", createAnnouncement);
router.get("/:id", getAnnouncementById);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

module.exports = router;