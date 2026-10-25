const Project = require("../models/Project");
const Builder = require("../models/Builder");
const Locality = require("../models/Locality");
const Amenity = require("../models/Amenity");

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const {
      status,
      featured,
      published,
      locality,
      builder,
      propertyType,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Filters
    if (status) {
      filter.status = status;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (published !== undefined) {
      filter.published = published === "true";
    }

    if (locality) {
      filter.locality = locality;
    }

    if (builder) {
      filter.builder = builder;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Search
    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * perPage;

    const [projects, totalProjects] = await Promise.all([
      Project.find(filter)
        .populate("builder", "name slug logo")
        .populate("locality", "name slug city")
        .populate("amenities", "name slug icon category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProjects / perPage);

    res.status(200).json({
      success: true,
      count: projects.length,
      pagination: {
        currentPage,
        perPage,
        totalProjects,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};


// GET SINGLE PROJECT BY SLUG
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      published: true,
    })
      .populate("builder")
      .populate("locality")
      .populate("amenities")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};


// CREATE PROJECT

const createProject = async (req, res) => {
  try {
    const body = req.body;

    // -----------------------------
    // FIND BUILDER
    // -----------------------------

    let builderId = body.builder;

    if (builderId && typeof builderId === "string" && !builderId.match(/^[0-9a-fA-F]{24}$/)) {
      const builder = await Builder.findOne({
        slug: builderId.toLowerCase(),
      });

      if (!builder) {
        return res.status(404).json({
          success: false,
          message: `Builder not found with slug: ${builderId}`,
        });
      }

      builderId = builder._id;
    }

    // -----------------------------
    // FIND LOCALITY
    // -----------------------------

    let localityId = body.locality;

    if (
      localityId &&
      typeof localityId === "string" &&
      !localityId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      const locality = await Locality.findOne({
        slug: localityId.toLowerCase(),
        city: "Pune",
      });

      if (!locality) {
        return res.status(404).json({
          success: false,
          message: `Locality not found with slug: ${localityId}`,
        });
      }

      localityId = locality._id;
    }

    // -----------------------------
    // FIND AMENITIES
    // -----------------------------

    let amenityIds = body.amenities || [];

    if (Array.isArray(amenityIds) && amenityIds.length > 0) {
      const amenitySlugs = amenityIds.filter(
        (item) =>
          typeof item === "string" &&
          !item.match(/^[0-9a-fA-F]{24}$/)
      );

      if (amenitySlugs.length > 0) {
        const amenities = await Amenity.find({
          slug: {
            $in: amenitySlugs.map((slug) => slug.toLowerCase()),
          },
        });

        const foundSlugs = new Set(
          amenities.map((amenity) => amenity.slug)
        );

        const missingSlugs = amenitySlugs.filter(
          (slug) => !foundSlugs.has(slug.toLowerCase())
        );

        if (missingSlugs.length > 0) {
          return res.status(404).json({
            success: false,
            message: "Some amenities were not found",
            missingAmenities: missingSlugs,
          });
        }

        const slugToId = new Map(
          amenities.map((amenity) => [
            amenity.slug,
            amenity._id,
          ])
        );

        amenityIds = amenityIds.map((item) => {
          if (/^[0-9a-fA-F]{24}$/.test(item)) {
            return item;
          }

          return slugToId.get(item.toLowerCase());
        });
      }
    }

    // -----------------------------
    // CHECK DUPLICATE SLUG
    // -----------------------------

    const existingProject = await Project.findOne({
      slug: body.slug,
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "A project with this slug already exists",
        data: existingProject,
      });
    }

    // -----------------------------
    // CREATE PROJECT
    // -----------------------------

    const projectData = {
      ...body,

      builder: builderId,
      locality: localityId,
      amenities: amenityIds,

      location: {
        ...(body.location || {}),
        city: "Pune",
        state: "Maharashtra",
      },
    };

    const project = await Project.create(projectData);

    // -----------------------------
    // RETURN POPULATED PROJECT
    // -----------------------------

    const populatedProject = await Project.findById(project._id)
      .populate("builder")
      .populate("locality")
      .populate("amenities")
      .lean();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const existingProject = await Project.findById(projectId);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // If slug is being changed, make sure it is unique
    if (req.body.slug && req.body.slug !== existingProject.slug) {
      const duplicateSlug = await Project.findOne({
        slug: req.body.slug,
        _id: { $ne: projectId },
      });

      if (duplicateSlug) {
        return res.status(409).json({
          success: false,
          message: "Another project already uses this slug",
        });
      }
    }

    const updateData = {
      ...req.body,
    };

    // Keep Pune fixed
    if (req.body.location) {
      updateData.location = {
        ...req.body.location,
        city: "Pune",
        state: "Maharashtra",
      };
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("builder")
      .populate("locality")
      .populate("amenities")
      .lean();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};


// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};


// GET PROJECT BY ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("builder")
      .populate("locality")
      .populate("amenities")
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project by ID error:", error);

    res.status(400).json({
      success: false,
      message: "Invalid project ID",
      error: error.message,
    });
  }
};


module.exports = {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};