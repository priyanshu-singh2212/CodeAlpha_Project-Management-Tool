import { useEffect } from "react";
import { Trash2, CheckCheck } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import {
  markAsRead,
  deleteNotification,
} from "../api/notificationApi";

const Notifications = () => {
  const {
    notifications,
    fetchNotifications,
    fetchUnreadCount,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <p className="text-gray-500 text-lg">
              No Notifications Found
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                className={`rounded-xl shadow-md p-5 transition hover:shadow-xl border ${
                  notification.isRead
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-500"
                }`}
              >

                <div className="flex justify-between items-start">

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {notification.sender?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-gray-800">
                        {notification.sender?.name}
                      </h3>

                      <p className="text-gray-700 mt-2">
                        {notification.message}
                      </p>

                      <p className="text-sm text-gray-400 mt-3">
                        {formatDate(notification.createdAt)}
                      </p>

                    </div>

                  </div>

                  {!notification.isRead && (
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      New
                    </span>
                  )}

                </div>

                <div className="flex gap-3 mt-5">

                  {!notification.isRead && (
                    <button
                      onClick={() => handleRead(notification._id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCheck size={18} />
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;