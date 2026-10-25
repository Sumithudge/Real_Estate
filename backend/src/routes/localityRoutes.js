const express = require("express");

const {
  getLocalities,
  getLocalityBySlug,
  createLocality,
} = require("../controllers/localityController");

const router = express.Router();

router.get("/", getLocalities);
router.get("/:slug", getLocalityBySlug);
router.post("/", createLocality);

module.exports = router;