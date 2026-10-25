const express = require("express");

const {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// GET all projects
router.get("/", getProjects);

// CREATE project
router.post("/", createProject);

// GET project by ID
router.get("/id/:id", getProjectById);

// UPDATE project
router.put("/:id", updateProject);

// DELETE project
router.delete("/:id", deleteProject);

// GET project by slug
router.get("/:slug", getProjectBySlug);

module.exports = router;