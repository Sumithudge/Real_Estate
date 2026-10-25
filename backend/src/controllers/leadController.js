const Lead = require("../models/Lead");
const Project = require("../models/Project");

// CREATE LEAD
const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      message,
      project,
      source = "Website",
    } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    // Validate project if provided
    let projectId = null;

    if (project) {
      const projectExists = await Project.findById(project);

      if (!projectExists) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      projectId = projectExists._id;
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      message,
      project: projectId,
      source,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate("project", "name slug")
      .lean();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: populatedLead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};


// GET ALL LEADS
const getLeads = async (req, res) => {
  try {
    const {
      status,
      source,
      project,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (source) {
      filter.source = source;
    }

    if (project) {
      filter.project = project;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (currentPage - 1) * perPage;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(filter)
        .populate("project", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalLeads / perPage);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        currentPage,
        perPage,
        totalLeads,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      data: leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};


// GET SINGLE LEAD
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("project", "name slug")
      .lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    res.status(400).json({
      success: false,
      message: "Invalid lead ID",
      error: error.message,
    });
  }
};


// UPDATE LEAD
const updateLead = async (req, res) => {
  try {
    const allowedFields = [
      "status",
      "notes",
      "assignedTo",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("project", "name slug")
      .lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};


// DELETE LEAD
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    res.status(400).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};


module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
};