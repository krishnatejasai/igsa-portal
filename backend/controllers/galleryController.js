const Gallery = require("../models/Gallery");

const createAlbum = async (req, res) => {
  try {
    const { album, photos } = req.body;

    if (!album || !photos || photos.length === 0) {
      return res.status(400).json({
        message: "Album name and at least one photo are required",
      });
    }

    const newAlbum = await Gallery.create({
      album,
      photos,
    });

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAlbums = async (req, res) => {
  try {
    const albums = await Gallery.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    await album.deleteOne();

    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlbum,
  getAlbums,
  deleteAlbum,
};