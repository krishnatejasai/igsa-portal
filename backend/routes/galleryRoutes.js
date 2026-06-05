const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createAlbum,
  getAlbums,
  deleteAlbum,
} = require("../controllers/galleryController");

router.get("/", getAlbums);
router.post("/", protect, createAlbum);
router.delete("/:id", protect, deleteAlbum);

module.exports = router;