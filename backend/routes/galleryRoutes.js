const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createPhoto,
  getPhotos,
  deletePhoto,
} = require("../controllers/galleryController");

router.get("/", getPhotos);

router.post("/", protect, createPhoto);
router.delete("/:id", protect, deletePhoto);

module.exports = router;