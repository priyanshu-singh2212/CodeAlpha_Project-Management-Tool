import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { toast } from "react-toastify";
import {
  getNotifications,
  getUnreadCount,
} from "../api/notificationApi";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Unread Count
  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.log(error);
    }
  };

  // Add New Notification
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?._id) {
      socket.emit("joinUser", user._id);
    }

    socket.on("newNotification", (notification) => {
  console.log("NEW NOTIFICATION RECEIVED", notification);

  addNotification(notification);

  toast.success(notification.message);
});
socket.on("notificationCountUpdated", (count) => {
  console.log("COUNT UPDATED", count);

  setUnreadCount(count);
});

    return () => {
      socket.off("newNotification");
      socket.off("notificationCountUpdated");
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        fetchUnreadCount,
        setNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);