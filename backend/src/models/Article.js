const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
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

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
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

articleSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
});

articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ published: 1 });
articleSchema.index({ publishedAt: -1 });

module.exports = mongoose.model("Article", articleSchema);