const Project = require("../models/project");
const Task = require("../models/taskModel");
const User = require("../models/user");

const getDashboardStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();

    const todoTasks = await Task.countDocuments({
      status: { $regex: /^todo$/i },
    });

    const reviewTasks = await Task.countDocuments({
      status: { $regex: /^review$/i },
    });

    const inProgressTasks = await Task.countDocuments({
      status: { $regex: /^in progress$/i },
    });

    const completedTasks = await Task.countDocuments({
      status: { $regex: /^completed$/i },
    });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        todoTasks,
        reviewTasks,
        inProgressTasks,
        completedTasks,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboardStats };