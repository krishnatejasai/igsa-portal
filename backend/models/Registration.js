const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    eventTitle: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    ufid: {
      type: String,
      required: true,
    },

    program: {
      type: String,
      required: true,
    },

    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: ["registered", "waitlisted"],
      default: "registered",
    },

    waitlistPosition: {
      type: Number,
      default: null,
    },

    promotedAt: {
      type: Date,
      default: null,
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registrationSchema);