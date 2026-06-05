const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    album: {
      type: String,
      required: true,
    },

    photos: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);