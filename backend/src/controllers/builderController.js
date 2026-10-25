const Builder = require("../models/Builder");

const getBuilders = async (req, res) => {
  try {
    const { featured, published, search } = req.query;

    const filter = {};

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (published !== undefined) {
      filter.published = published === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const builders = await Builder.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: builders.length,
      data: builders,
    });
  } catch (error) {
    console.error("Get builders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch builders",
      error: error.message,
    });
  }
};

const getBuilderBySlug = async (req, res) => {
  try {
    const builder = await Builder.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

    if (!builder) {
      return res.status(404).json({
        success: false,
        message: "Builder not found",
      });
    }

    res.status(200).json({
      success: true,
      data: builder,
    });
  } catch (error) {
    console.error("Get builder error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch builder",
      error: error.message,
    });
  }
};

const createBuilder = async (req, res) => {
  try {
    const builder = await Builder.create(req.body);

    res.status(201).json({
      success: true,
      message: "Builder created successfully",
      data: builder,
    });
  } catch (error) {
    console.error("Create builder error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create builder",
      error: error.message,
    });
  }
};

module.exports = {
  getBuilders,
  getBuilderBySlug,
  createBuilder,
};