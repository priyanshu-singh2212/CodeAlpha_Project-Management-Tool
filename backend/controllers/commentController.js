const { getIO } = require("../socket");
const Comment = require("../models/comment");
const Task = require("../models/taskModel");
const sendNotification = require("../utils/sendNotification");
const User = require("../models/user");
const ActivityLog = require("../models/ActivityLog");

const createComment = async (req, res) => {
  try {
    const { content, taskId } = req.body;

    const comment = await Comment.create({
      content,
      taskId,
      userId: req.user.id,
    });

  

    // Task details
    const task = await Task.findById(taskId);


// Sender details
const sender = await User.findById(req.user.id);

    if (task) {
  await ActivityLog.create({
    action: "Comment Added",
    project: task.project,
    task: task._id,
    user: req.user.id,
    details: `${sender.name} commented on task "${task.title}"`,
  });
}

    // Real-time comment event to project room
    if (task) {
     const populatedComment = await Comment.findById(comment._id)
  .populate("userId", "name email");

getIO()
  .to(`project_${task.project}`)
  .emit("newComment", populatedComment);
    }

    
    // Notify assigned user (except self)
    if (
      task &&
      task.assignedTo &&
      task.assignedTo.toString() !== req.user.id
    ) {
      await sendNotification({
        recipient: task.assignedTo,
        sender: req.user.id,
        type: "comment_added",
      message: `${sender.name} commented: "${content}" on task "${task.title}"`,
        taskId: task._id,
        projectId: task.project,
      });
    }

    res.status(201).json({
      success: true,
      comment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      taskId: req.params.taskId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Sirf owner apna comment delete kar sakta hai
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Task details for project room
    const task = await Task.findById(comment.taskId);
    const user = await User.findById(req.user.id);

if (task) {
  await ActivityLog.create({
    action: "Comment Deleted",
    project: task.project,
    task: task._id,
    user: req.user.id,
    details: `${user.name} deleted a comment from task "${task.title}"`,
  });
}

    await Comment.findByIdAndDelete(req.params.commentId);

    // Real-time event
    if (task) {
      getIO()
        .to(`project_${task.project}`)
        .emit("commentDeleted", {
          commentId: comment._id,
          taskId: comment.taskId,
        });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Sirf owner apna comment update kar sakta hai
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    comment.content = req.body.content || comment.content;

    await comment.save();

    // Task details for project room
    const task = await Task.findById(comment.taskId);

    const user = await User.findById(req.user.id);

if (task) {
  await ActivityLog.create({
    action: "Comment Updated",
    project: task.project,
    task: task._id,
    user: req.user.id,
    details: `${user.name} updated a comment on task "${task.title}"`,
  });
}

const populatedComment = await Comment.findById(
  comment._id
).populate("userId", "name email");

if (task) {
  getIO()
    .to(`project_${task.project}`)
    .emit("commentUpdated", populatedComment);
}

res.status(200).json({
  success: true,
  comment: populatedComment,
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
    createComment,
    getTaskComments,
    deleteComment,
    updateComment,
};