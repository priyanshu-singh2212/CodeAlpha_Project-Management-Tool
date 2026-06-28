const sendNotification = require("../utils/sendNotification");
const { getIO } = require("../socket");
const Task = require("../models/taskModel");
const ActivityLog = require("../models/ActivityLog");
// Create Task
const createTask = async (req, res) => {
  try {
    console.log("BODY =", req.body);

    const taskData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "Todo",
      priority: req.body.priority || "Medium",
      project: req.body.project,
assignedTo: req.body.assignedTo ? req.body.assignedTo : undefined,
      dueDate: req.body.dueDate || null,
      createdBy: req.user.id,
    };


    if (!req.body.project) {
  return res.status(400).json({ message: "Project ID required" });
}
    const task = await Task.create(taskData);
    getIO()
  .to(`project_${task.project}`)
  .emit("newTask", task);
const log = await ActivityLog.create({
  action: "Task Created",
  task: task._id,
  project: task.project,
  user: req.user.id,
  details: `${req.user.id} created task ${task.title}`,
});

console.log("Activity Log Saved =", log);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Tasks of a Project
const getProjectTasks = async (req, res) => {
  try {

    let query = {
      project: req.params.projectId,
    };

    // Search by title
    if (req.query.keyword) {
      query.title = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Priority filter
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    // Total tasks count
    const totalTasks = await Task.countDocuments(query);
const tasks = await Task.find(query)
  .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      page,
      pages: Math.ceil(totalTasks / limit),
      totalTasks,
      count: tasks.length,
      tasks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({ message: error.message });
  }
};


// Update Task
const mongoose = require("mongoose");

const updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);

    if (!oldTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ✅ SAFE UPDATE DATA
    const updateData = {
      ...req.body,
    };

    // 🔥 FIX: assignedTo validation
    if (req.body.assignedTo) {
      if (mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
        updateData.assignedTo = req.body.assignedTo;
      } else {
        updateData.assignedTo = null;
      }
    }

    // 🔥 FIX: dueDate validation
    if (req.body.dueDate) {
      updateData.dueDate = new Date(req.body.dueDate);
    }

    let task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    // socket update
    getIO().to(`project_${task.project}`).emit("taskUpdated", task);

    // activity log
    await ActivityLog.create({
      action: "Task Updated",
      task: task._id,
      project: task.project,
      user: req.user.id,
      details: `${req.user.id} updated task ${task.title}`,
    });

    // notification: assignment change
    if (
      req.body.assignedTo &&
      oldTask.assignedTo?.toString() !== req.body.assignedTo
    ) {
      await sendNotification({
        recipient: req.body.assignedTo,
        sender: req.user.id,
        type: "task_assigned",
        message: `You have been assigned the task "${task.title}"`,
        taskId: task._id,
        projectId: task.project,
      });
    }

    // status change notification
    if (
      req.body.status &&
      oldTask.status !== req.body.status &&
      task.assignedTo
    ) {
      await sendNotification({
        recipient: task.assignedTo,
        sender: req.user.id,
        type: "task_status_changed",
        message: `Task "${task.title}" status changed to ${task.status}`,
        taskId: task._id,
        projectId: task.project,
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });

  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
getIO()
  .to(`project_${task.project}`)
  .emit("taskDeleted", {
    taskId: task._id,
  });
await ActivityLog.create({
  action: "Task Deleted",
  task: task._id,
  project: task.project,
  user: req.user.id,
  details: `${req.user.id} deleted task ${task.title}`,
});
    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Overdue Tasks
const getOverdueTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" }
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// Dashboard Stats
const getTaskStats = async (req, res) => {
  try {

    const totalTasks = await Task.countDocuments();

    const todoTasks = await Task.countDocuments({
      status: "Todo",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const highPriorityTasks = await Task.countDocuments({
      priority: "High",
    });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    res.status(200).json({
      success: true,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
      overdueTasks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// Export All Controllers
module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getOverdueTasks,
  getTaskStats
};