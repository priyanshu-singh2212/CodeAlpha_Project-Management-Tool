const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "task_assigned",
        "comment_added",
        "task_status_changed",
        "project_invitation",
        "project_updated",
        "task_deleted",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// For faster queries
notificationSchema.index({
  recipient: 1,
  isRead: 1,
});

module.exports = mongoose.model("Notification", notificationSchema);