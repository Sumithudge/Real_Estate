const express = require("express");

const {
  getBuilders,
  getBuilderBySlug,
  createBuilder,
} = require("../controllers/builderController");

const router = express.Router();

router.get("/", getBuilders);
router.get("/:slug", getBuilderBySlug);
router.post("/", createBuilder);

module.exports = router;