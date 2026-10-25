const mongoose = require("mongoose");

const localitySchema = new mongoose.Schema(
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

    city: {
      type: String,
      default: "Pune",
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    popularFor: [
      {
        type: String,
        trim: true,
      },
    ],

    nearbyLocalities: [
      {
        type: String,
        trim: true,
      },
    ],

    averagePrice: {
      type: String,
      trim: true,
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: true,
    },

    seo: {
      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      keywords: [
        {
          type: String,
          trim: true,
        },
      ],

      canonicalUrl: {
        type: String,
        trim: true,
      },

      ogImage: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

localitySchema.index({
  name: "text",
  description: "text",
});

localitySchema.index({ city: 1 });
localitySchema.index({ featured: 1 });
localitySchema.index({ published: 1 });

module.exports = mongoose.model("Locality", localitySchema);