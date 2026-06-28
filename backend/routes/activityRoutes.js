const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProjectActivity,
} = require("../controllers/activityController");

router.get("/:projectId", authMiddleware, getProjectActivity);

module.exports = router;