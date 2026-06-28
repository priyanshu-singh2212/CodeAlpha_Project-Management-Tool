import { useState } from "react";
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../context/NotificationContext";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-bell">

      <button
        className="bell-btn"
        onClick={() => setOpen(!open)}
      >
        <FaBell size={22} />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          closeDropdown={() => setOpen(false)}
        />
      )}

    </div>
  );
};

export default NotificationBell;