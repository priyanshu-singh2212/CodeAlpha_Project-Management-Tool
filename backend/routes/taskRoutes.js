const express = require("express");
const router = express.Router();

const {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  getOverdueTasks,
  getTaskStats,
  getTaskById,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createTask);

router.get("/stats", protect, getTaskStats);

router.get("/overdue", protect, getOverdueTasks);

router.get("/project/:projectId", protect, getProjectTasks);

router.get("/:id", protect, getTaskById);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);


module.exports = router;