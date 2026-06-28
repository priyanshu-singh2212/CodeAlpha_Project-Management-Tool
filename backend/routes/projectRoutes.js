const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require("../controllers/projectController");

console.log("authMiddleware:", typeof authMiddleware);

// Create Project
router.post(
  "/",
  authMiddleware,
  createProject
);

// Get All Projects
router.get(
  "/",
  authMiddleware,
  getProjects
);

// Get Single Project
router.get(
  "/:id",
  authMiddleware,
  getProjectById
);
router.put(
  "/:id",
  authMiddleware,
  updateProject
);

// Add Member to Project
router.put(
  "/:id/add-member",
  authMiddleware,
  addMember
);

router.put(
  "/:id/remove-member",
  authMiddleware,
  removeMember
);

// Delete Project
router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);

module.exports = router;