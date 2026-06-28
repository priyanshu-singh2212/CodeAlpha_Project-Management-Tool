const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");



router.get("/", verifyToken, getNotifications);

router.get("/unread/count", verifyToken, getUnreadCount);

router.put("/:notificationId/read", verifyToken, markAsRead);

router.delete("/:notificationId", verifyToken, deleteNotification);

module.exports = router;