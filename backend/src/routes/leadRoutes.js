const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public enquiry submission
router.post("/", createLead);

// Admin lead management
router.get("/", protect, adminOnly, getLeads);
router.get("/:id", protect, adminOnly, getLeadById);
router.put("/:id", protect, adminOnly, updateLead);
router.delete("/:id", protect, adminOnly, deleteLead);

module.exports = router;