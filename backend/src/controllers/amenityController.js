const Amenity = require("../models/Amenity");

// GET all amenities
const getAmenities = async (req, res) => {
  try {
    const { category, published, search } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (published !== undefined) {
      filter.published = published === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const amenities = await Amenity.find(filter)
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: amenities.length,
      data: amenities,
    });
  } catch (error) {
    console.error("Get amenities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch amenities",
      error: error.message,
    });
  }
};

// GET single amenity by slug
const getAmenityBySlug = async (req, res) => {
  try {
    const amenity = await Amenity.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: "Amenity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: amenity,
    });
  } catch (error) {
    console.error("Get amenity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch amenity",
      error: error.message,
    });
  }
};

// CREATE single amenity
const createAmenity = async (req, res) => {
  try {
    const { slug } = req.body;

    // Check if amenity already exists
    const existingAmenity = await Amenity.findOne({ slug });

    if (existingAmenity) {
      return res.status(200).json({
        success: true,
        message: "Amenity already exists",
        data: existingAmenity,
        alreadyExists: true,
      });
    }

    const amenity = await Amenity.create(req.body);

    res.status(201).json({
      success: true,
      message: "Amenity created successfully",
      data: amenity,
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Create amenity error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create amenity",
      error: error.message,
    });
  }
};

// CREATE MULTIPLE AMENITIES SAFELY
const createAmenitiesBulk = async (req, res) => {
  try {
    const amenities = req.body;

    if (!Array.isArray(amenities) || amenities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array",
      });
    }

    // Get all incoming slugs
    const slugs = amenities
      .map((amenity) => amenity.slug)
      .filter(Boolean);

    // Find amenities that already exist
    const existingAmenities = await Amenity.find({
      slug: { $in: slugs },
    }).lean();

    const existingSlugs = new Set(
      existingAmenities.map((amenity) => amenity.slug)
    );

    // Keep only new amenities
    const newAmenities = amenities.filter(
      (amenity) => amenity.slug && !existingSlugs.has(amenity.slug)
    );

    let createdAmenities = [];

    if (newAmenities.length > 0) {
      createdAmenities = await Amenity.insertMany(newAmenities);
    }

    res.status(201).json({
      success: true,
      message: "Amenity setup completed successfully",
      requested: amenities.length,
      alreadyExists: existingAmenities.length,
      created: createdAmenities.length,
      data: createdAmenities,
      existing: existingAmenities,
    });
  } catch (error) {
    console.error("Create amenities bulk error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to setup amenities",
      error: error.message,
    });
  }
};

module.exports = {
  getAmenities,
  getAmenityBySlug,
  createAmenity,
  createAmenitiesBulk,
};