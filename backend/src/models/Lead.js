const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    source: {
      type: String,
      enum: [
        "Website",
        "Project Page",
        "Contact Page",
        "WhatsApp",
        "Google",
        "Other",
      ],
      default: "Website",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Interested",
        "Follow Up",
        "Converted",
        "Closed",
      ],
      default: "New",
    },

    notes: {
      type: String,
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ project: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);