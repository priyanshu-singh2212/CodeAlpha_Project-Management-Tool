const ActivityLog = require("../models/ActivityLog");

const getProjectActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      project: req.params.projectId,
    })
      .populate("user", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProjectActivity,
};