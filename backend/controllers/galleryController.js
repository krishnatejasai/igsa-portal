const Model = require("../models/Gallery");
const { galleryInput } = require("../utils/contentValidation");
const fail = (res, error) => res.status(error.name === "CastError" || error.name === "ValidationError" ? 400 : 500).json({ message: "Unable to process this request. Please try again." });
const createAlbum = async (req, res) => {
  let input;
  try { input = galleryInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try { res.status(201).json(await Model.create(input)); } catch (error) { fail(res, error); }
};
const getAlbums = async (req, res) => {
  try {
    if (req.query?.summary === "1") {
      return res.json(await Model.aggregate([
        { $sort: { createdAt: -1 } },
        { $project: {
          album: 1, description: 1, externalUrl: 1, image: 1, createdAt: 1,
          photos: { $slice: [{ $ifNull: ["$photos", []] }, 1] },
          photoCount: { $size: { $ifNull: ["$photos", []] } },
        } },
      ]));
    }
    res.json(await Model.find().sort({ createdAt: -1 }));
  } catch (error) { fail(res, error); }
};
const getById = async (req, res) => {
  try { const item = await Model.findById(req.params.id); if (!item) return res.status(404).json({ message: "Not found" }); res.json(item); } catch (error) { fail(res, error); }
};
const updateAlbum = async (req, res) => {
  let input;
  try { input = galleryInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try { const item = await Model.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: "Not found" }); res.json(item); } catch (error) { fail(res, error); }
};
const deleteAlbum = async (req, res) => {
  try { const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: "Not found" }); res.json({ message: "Deleted successfully" }); } catch (error) { fail(res, error); }
};
module.exports = { createAlbum, getAlbums, getById, updateAlbum, deleteAlbum };
