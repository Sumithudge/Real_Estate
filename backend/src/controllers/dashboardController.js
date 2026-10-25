const Project = require("../models/Project");
const Builder = require("../models/Builder");
const Locality = require("../models/Locality");
const Amenity = require("../models/Amenity");
const Lead = require("../models/Lead");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      newLaunches,
      underConstruction,
      readyToMove,
      builders,
      localities,
      amenities,
      totalLeads,
      newLeads,

      recentProjects,
      recentLeads,

      projectStatusDistribution,
      leadStatusDistribution,
    ] = await Promise.all([
      // PROJECTS
      Project.countDocuments(),

      Project.countDocuments({
        published: true,
      }),

      Project.countDocuments({
        published: false,
      }),

      Project.countDocuments({
        status: "New Launch",
      }),

      Project.countDocuments({
        status: "Under Construction",
      }),

      Project.countDocuments({
        status: "Ready to Move",
      }),

      // OTHER
      Builder.countDocuments(),

      Locality.countDocuments({
        city: "Pune",
      }),

      Amenity.countDocuments(),

      // LEADS
      Lead.countDocuments(),

      Lead.countDocuments({
        status: "New",
      }),

      // RECENT PROJECTS
      Project.find()
        .populate("builder", "name slug")
        .populate("locality", "name slug")
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name slug status published featured createdAt builder locality"
        )
        .lean(),

      // RECENT LEADS
      Lead.find()
        .populate("project", "name slug")
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name phone email status source project createdAt"
        )
        .lean(),

      // PROJECT STATUS
      Project.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // LEAD STATUS
      Lead.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,

      data: {
        overview: {
          totalProjects,
          publishedProjects,
          draftProjects,

          newLaunches,
          underConstruction,
          readyToMove,

          builders,
          localities,
          amenities,

          totalLeads,
          newLeads,
        },

        recentProjects,

        recentLeads,

        projectStatusDistribution,

        leadStatusDistribution,
      },
    });
  } catch (error) {
    console.error(
      "Get dashboard stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};