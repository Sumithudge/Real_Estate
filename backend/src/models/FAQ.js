const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    locality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locality",
    },

    category: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.index({ project: 1 });
faqSchema.index({ locality: 1 });
faqSchema.index({ order: 1 });

module.exports = mongoose.model("FAQ", faqSchema);