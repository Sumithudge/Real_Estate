const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    minPrice: {
      type: Number,
      min: 0,
    },

    maxPrice: {
      type: Number,
      min: 0,
    },

    minArea: {
      type: Number,
      min: 0,
    },

    maxArea: {
      type: Number,
      min: 0,
    },

    priceLabel: {
      type: String,
      trim: true,
    },

    areaLabel: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const nearbyPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      trim: true,
    },

    distance: {
      type: String,
      trim: true,
    },

    travelTime: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
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

    builder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Builder",
    },

    locality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locality",
    },

    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Plot",
        "Row House",
        "Commercial",
        "Penthouse",
        "Other",
      ],
      default: "Apartment",
    },

    configurations: [configurationSchema],

    status: {
      type: String,
      enum: [
        "New Launch",
        "Under Construction",
        "Ready to Move",
        "Upcoming",
        "Completed",
      ],
      default: "New Launch",
    },

    possessionDate: {
      type: Date,
    },

    reraNumber: {
      type: String,
      trim: true,
    },

    totalUnits: {
      type: Number,
      min: 0,
    },

    totalTowers: {
      type: Number,
      min: 0,
    },

    totalFloors: {
      type: Number,
      min: 0,
    },

    landArea: {
      type: String,
      trim: true,
    },

    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        alt: {
          type: String,
          trim: true,
        },

        title: {
          type: String,
          trim: true,
        },

        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    floorPlans: [
      {
        name: {
          type: String,
          trim: true,
        },

        bhk: {
          type: String,
          trim: true,
        },

        area: {
          type: String,
          trim: true,
        },

        image: {
          type: String,
          trim: true,
        },

        price: {
          type: String,
          trim: true,
        },
      },
    ],

    location: {
      address: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        default: "Pune",
        trim: true,
      },

      state: {
        type: String,
        default: "Maharashtra",
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      mapUrl: {
        type: String,
        trim: true,
      },
    },

    nearbyPlaces: [nearbyPlaceSchema],

    videoUrl: {
      type: String,
      trim: true,
    },

    brochureUrl: {
      type: String,
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    published: {
      type: Boolean,
      default: false,
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

      ogTitle: {
        type: String,
        trim: true,
      },

      ogDescription: {
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

projectSchema.index({
  name: "text",
  shortDescription: "text",
  description: "text",
});


projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ published: 1 });
projectSchema.index({ "location.city": 1 });

module.exports = mongoose.model("Project", projectSchema);