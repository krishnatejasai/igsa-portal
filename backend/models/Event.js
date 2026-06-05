const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      default: 0,
    },

    location: {
  type: String,
  required: true,
},

registrationOpen: {
  type: Boolean,
  default: true,
},

    description: {
      type: String,
      required: true,
    },

    registrationLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);