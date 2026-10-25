const Locality = require("../models/Locality");

const getLocalities = async (req, res) => {
  try {
    const { featured, published, search } = req.query;

    const filter = {
      city: "Pune",
    };

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (published !== undefined) {
      filter.published = published === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const localities = await Locality.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: localities.length,
      data: localities,
    });
  } catch (error) {
    console.error("Get localities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch localities",
      error: error.message,
    });
  }
};

const getLocalityBySlug = async (req, res) => {
  try {
    const locality = await Locality.findOne({
      slug: req.params.slug,
      city: "Pune",
      published: true,
    }).lean();

    if (!locality) {
      return res.status(404).json({
        success: false,
        message: "Locality not found",
      });
    }

    res.status(200).json({
      success: true,
      data: locality,
    });
  } catch (error) {
    console.error("Get locality error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch locality",
      error: error.message,
    });
  }
};

const createLocality = async (req, res) => {
  try {
    const locality = await Locality.create({
      ...req.body,
      city: "Pune",
    });

    res.status(201).json({
      success: true,
      message: "Locality created successfully",
      data: locality,
    });
  } catch (error) {
    console.error("Create locality error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create locality",
      error: error.message,
    });
  }
};

module.exports = {
  getLocalities,
  getLocalityBySlug,
  createLocality,
};