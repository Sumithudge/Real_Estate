const mongoose = require("mongoose");

const builderSchema = new mongoose.Schema(
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

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    establishedYear: {
      type: Number,
    },

    headquarters: {
      type: String,
      trim: true,
    },

    projectsCount: {
      type: Number,
      default: 0,
      min: 0,
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

builderSchema.index({
  name: "text",
  shortDescription: "text",
  description: "text",
});


builderSchema.index({ featured: 1 });
builderSchema.index({ published: 1 });

module.exports = mongoose.model("Builder", builderSchema);