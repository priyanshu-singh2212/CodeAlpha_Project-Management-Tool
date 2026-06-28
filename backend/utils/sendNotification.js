const Notification = require("../models/notification");
const { getIO } = require("../socket");

const sendNotification = async ({
  recipient,
  sender,
  type,
  message,
  taskId = null,
  projectId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      taskId,
      projectId,
    });

    const populatedNotification = await Notification.findById(notification._id)
      .populate("sender", "name email");

    console.log("Sending notification to:", recipient);
    console.log("Notification:", populatedNotification);

    getIO()
      .to(`user_${recipient}`)
      .emit("newNotification", populatedNotification);

    console.log("Socket event emitted");

    const unreadCount = await Notification.countDocuments({
      recipient,
      isRead: false,
    });

    getIO()
      .to(`user_${recipient}`)
      .emit("notificationCountUpdated", unreadCount);

    console.log("Unread Count:", unreadCount);

    return populatedNotification;

  } catch (error) {
    console.error("Send notification error:", error);
  }
};

module.exports = sendNotification;