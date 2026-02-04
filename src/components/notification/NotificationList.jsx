import React from "react";
import { Trash2, Check, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}) => {
  const navigate = useNavigate();

  const handleClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Handle specific notification types first
    switch (notification.type) {
      case "FRIEND_REQUEST":
        navigate(`/dashboard/friends?tab=requests`);
        return;
      case "GROUP_INVITE":
      case "GROUP_INVITATION":
        navigate(`/dashboard/groups?tab=invites`);
        return;
      case "REPORT_SUBMITTED":
        // Admin notification
        navigate(`/admin-website/reports`);
        return;
      case "REPORT_UPDATED":
      case "WARNING":
      case "AI_STRIKE_WARNING":
      case "ROLE_CHANGE":
        navigate(`/dashboard/my-profile`);
        return;
      case "GROUP_DELETED":
        navigate(`/dashboard/groups`);
        return;
    }

    // General targetType fallback
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
        navigate(`/dashboard/friends?tab=requests`);
        break;
      case "ROLE_CHANGE":
        navigate(`/dashboard/my-profile`);
        break;
      default:
        navigate("/dashboard/feed");
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    onMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    if (unreadCount === 0) {
      toast.info("Tất cả thông báo đã được đọc");
      return;
    }
    onMarkAllAsRead();
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="w-full h-full bg-surface-main flex flex-col">
        <div className="p-4 border-b border-border-main font-bold text-base text-text-main">
          Thông báo
        </div>
        <div className="p-8 text-center">
          <div className="size-16 rounded-full bg-background-main border-2 border-border-main flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-3xl text-text-secondary/30">
              notifications_off
            </span>
          </div>
          <p className="text-text-secondary text-sm">Không có thông báo nào</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="w-full bg-surface-main flex flex-col h-full">
      {/* Header */}
      <div className="p-2.5 border-b border-border-main flex items-center justify-between bg-gradient-to-r from-surface-main to-background-main">
        <div>
          <h3 className="font-bold text-[13px] text-text-main">Thông báo</h3>
          {unreadCount > 0 && (
            <p className="text-[10px] text-text-secondary mt-0.5">
              {unreadCount} chưa đọc
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-text-main rounded-lg transition-all text-[10px] font-bold"
            title="Đánh dấu tất cả đã đọc"
          >
            <CheckCheck size={12} />
            <span className="hidden sm:inline">Đọc tất cả</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-72 overflow-y-auto custom-scrollbar">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-2 p-2.5 border-b border-border-main cursor-pointer hover:bg-background-main transition-all group ${
              !notification.isRead ? "bg-primary/5" : ""
            }`}
            onClick={() => handleClick(notification)}
          >
            {/* Avatar */}
            <img
              src={
                notification.actorAvatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-border-main"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-text-main line-clamp-2 leading-relaxed">
                {notification.content}
              </p>
              <p className="text-[10px] text-text-secondary mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[11px]">
                  schedule
                </span>
                {timeAgo(notification.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <button
                  onClick={(e) => handleMarkAsRead(e, notification.id)}
                  className="p-1.5 hover:bg-primary/20 text-primary rounded-lg transition-all"
                  title="Đánh dấu đã đọc"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={(e) => handleDelete(e, notification.id)}
                className="p-1.5 hover:bg-red-500/20 text-text-secondary hover:text-red-500 rounded-lg transition-all"
                title="Xóa thông báo"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Unread Indicator */}
            {!notification.isRead && (
              <div className="size-2.5 rounded-full bg-primary mt-2 flex-shrink-0 shadow-lg shadow-primary/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
