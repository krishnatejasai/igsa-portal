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

    bookingVersion: { type: Number, default: 0, select: false },
    registrationFields: {
      phone: { type: String, enum: ['required', 'optional', 'hidden'], default: 'required' },
      ufid: { type: String, enum: ['required', 'optional', 'hidden'], default: 'required' },
      program: { type: String, enum: ['required', 'optional', 'hidden'], default: 'required' },
    },
    slotQuestion: {
      enabled: { type: Boolean, default: false },
      label: { type: String, default: '' },
      options: [{ _id: false, id: String, label: String, capacity: Number }],
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
