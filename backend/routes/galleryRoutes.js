const express = require("express");

const router = express.Router();

const {
  createPhoto,
  getPhotos,
  deletePhoto,
} = require("../controllers/galleryController");

router.get("/", getPhotos);
router.post("/", createPhoto);
router.delete("/:id", deletePhoto);

module.exports = router;