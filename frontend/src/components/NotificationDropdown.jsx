import "./NotificationDropdown.css";

import {
  markAsRead,
  deleteNotification,
} from "../api/notificationApi";

import { useNotifications } from "../context/NotificationContext";

const NotificationDropdown = ({ closeDropdown }) => {

  const {
    notifications,
    fetchNotifications,
    fetchUnreadCount,
  } = useNotifications();

  const handleRead = async (id) => {

    await markAsRead(id);

    fetchNotifications();

    fetchUnreadCount();

  };

  const handleDelete = async (id) => {

    await deleteNotification(id);

    fetchNotifications();

    fetchUnreadCount();

  };

  return (

<div className="notification-dropdown">

<div className="dropdown-header">

<h3>Notifications</h3>

<button onClick={closeDropdown}>
✖
</button>

</div>

{notifications.length===0 ? (

<p className="empty">
No Notifications
</p>

) : (

notifications.map((notification)=>(

<div
key={notification._id}
className={`notification-item ${
notification.isRead ? "" : "unread"
}`}
>

<h4>

{notification.sender?.name}

</h4>

<p>

{notification.message}

</p>

<span>

{new Date(notification.createdAt).toLocaleString()}

</span>

<div className="notification-actions">

{

!notification.isRead && (

<button
onClick={()=>handleRead(notification._id)}
>

Read

</button>

)

}

<button
onClick={()=>handleDelete(notification._id)}
>

Delete

</button>

</div>

</div>

))

)}

</div>

  );

};

export default NotificationDropdown;