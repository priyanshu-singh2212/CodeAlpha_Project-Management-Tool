import api from "./axios";

// Get all notifications
export const getNotifications = () => {
  return api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

// Get unread notification count
export const getUnreadCount = () => {
  return api.get("/notifications/unread/count", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

// Mark notification as read
export const markAsRead = (notificationId) => {
  return api.put(
    `/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};

// Delete notification
export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

// Mark all notifications as read
export const markAllAsRead = () => {
  return api.put(
    "/notifications/read-all",
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};