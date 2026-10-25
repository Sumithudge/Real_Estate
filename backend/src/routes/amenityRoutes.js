const express = require("express");

const {
  getAmenities,
  getAmenityBySlug,
  createAmenity,
  createAmenitiesBulk,
} = require("../controllers/amenityController");

const router = express.Router();

router.get("/", getAmenities);

router.get("/:slug", getAmenityBySlug);

// IMPORTANT: bulk must come before "/"
router.post("/bulk", createAmenitiesBulk);

router.post("/", createAmenity);

module.exports = router;