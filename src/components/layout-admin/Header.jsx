import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";
import NotificationService from "../../services/NotificationService";
import toast from "react-hot-toast";
import NotificationDropdown from "../layout/NotificationDropdown";
import ConfirmModal from "../common/ConfirmModal";

const Header = ({ title = "Quản lý" }) => {
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    notificationId: null,
  });

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !confirmModalConfig.isOpen
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, confirmModalConfig.isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      dispatch(markAsRead(id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleConfirmDelete = async () => {
    const id = confirmModalConfig.notificationId;
    if (!id) return;
    try {
      await NotificationService.deleteNotification(id);
      dispatch(deleteNotification(id));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo");
    }
    setConfirmModalConfig({ isOpen: false, notificationId: null });
  };

  const handleDeleteRequest = (id) => {
    setConfirmModalConfig({
      isOpen: true,
      notificationId: id,
    });
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    if (unreadNotifications.length === 0) {
      toast.info("Tất cả thông báo đã được đọc");
      return;
    }

    const tid = toast.loading(
      `Đang đánh dấu ${unreadNotifications.length} thông báo...`,
    );

    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          NotificationService.markAsRead(notification.id),
        ),
      );
      dispatch(markAllAsRead());
      toast.success("Đã đánh dấu tất cả đã đọc", { id: tid });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc", { id: tid });
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-background-main shadow-sm z-30 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-text-main uppercase">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="md:block hidden">
          <AnimatedThemeToggler />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className={`p-2.5 rounded-xl transition-all relative flex items-center justify-center w-10 h-10 ${
              showNotifications
                ? "bg-primary text-[#231810]"
                : "bg-surface-main text-text-secondary hover:bg-surface-main/80 hover:text-text-main border border-border-main"
            }`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} weight="fill" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background-main">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteRequest}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title="Xóa thông báo?"
        message="Bạn có chắc muốn xóa thông báo này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onClose={() =>
          setConfirmModalConfig({ ...confirmModalConfig, isOpen: false })
        }
      />
    </header>
  );
};

export default Header;
