import React from "react";
import { IconTrash, IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " năm trước";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " tháng trước";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " ngày trước";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " giờ trước";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " phút trước";
  return "Vừa xong";
};

const NotificationList = ({ notifications, onMarkAsRead }) => {
  const navigate = useNavigate();

  const handleClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    switch (notification.targetType) {
      case "POST":
        navigate(`/dashboard/feed`);
        break;
      case "GROUP":
        navigate(`/dashboard/groups/${notification.targetId}`);
        break;
      case "USER":
        navigate(`/dashboard/member/${notification.targetId}`);
        break;
      case "FRIEND_REQUEST":
        navigate(`/dashboard/requests`);
        break;
      case "ROLE_CHANGE":
        navigate(`/dashboard/my-profile`);
        break;
      default:
        navigate("/dashboard/feed");
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-500 text-sm">
        Không có thông báo nào
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-96 overflow-y-auto w-full bg-surface-main border border-border-main rounded-md shadow-lg mt-2">
      <div className="p-2 border-b border-border-main font-semibold text-sm">
        Thông báo
      </div>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-3 border-b border-border-main cursor-pointer hover:bg-background-main transition-colors ${
            !notification.isRead ? "bg-primary/5" : ""
          }`}
          onClick={() => handleClick(notification)}
        >
          <img
            src={
              notification.actorAvatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-main line-clamp-2">
              <span className="font-semibold">{notification.actorName}</span>{" "}
              {notification.content.replace(notification.actorName, "")}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {timeAgo(notification.createdAt)}
            </p>
          </div>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
