const Gallery = require("../models/Gallery");

const createPhoto = async (req, res) => {
  try {
    const photo = await Gallery.create(req.body);
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    await photo.deleteOne();

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPhoto,
  getPhotos,
  deletePhoto,
};