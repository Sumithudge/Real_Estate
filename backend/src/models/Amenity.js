const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Lifestyle",
        "Sports",
        "Kids",
        "Security",
        "Convenience",
        "Green Living",
        "Other",
      ],
      default: "Other",
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

amenitySchema.index({ name: "text", description: "text" });
amenitySchema.index({ category: 1 });

module.exports = mongoose.model("Amenity", amenitySchema);