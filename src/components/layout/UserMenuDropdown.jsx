import React from "react";
import { useNavigate } from "react-router-dom";
import { Gear as Settings, Bell, SignOut as LogOut, CaretDown as ChevronDown } from "@phosphor-icons/react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { Avatar } from "../ui/avatar/Avatar";

const DropdownItem = ({ icon, label, onClick, danger }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  danger
                    ? "text-red-500 hover:bg-red-500/10"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                }
            `}
    >
      <div
        className={`p-1.5 rounded-lg transition-colors ${
          danger
            ? "bg-red-500/10"
            : "bg-gray-100 dark:bg-white/10 group-hover:bg-white dark:group-hover:bg-white/20"
        }`}
      >
        {icon}
      </div>
      <span className="flex-1 text-left">{label}</span>
      {!danger && (
        <span className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      )}
    </button>
  );
};
const UserMenuDropdown = ({ isOpen, onClose, onShowNotifications }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logout()).unwrap();
      if (result && !result.serverRevoked) {
        toast("Phiên đăng nhập đã xóa cục bộ. Máy chủ tạm thời không phản hồi.", { icon: "⚠️" });
      }
    } catch {
      // Ignored
    } finally {
      navigate("/login");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-72 bg-surface-main border border-border-main rounded-2xl overflow-hidden z-50 p-2"
        >
          {/* Profile Header */}
          <div
            className="p-3 mb-2 rounded-xl bg-surface-subtle border border-border-main cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => {
              navigate("/dashboard/my-profile");
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={userProfile?.currentAvatarUrl}
                name={userProfile?.fullName || user?.username || "U"}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-main truncate text-sm">
                  {userProfile?.fullName || user?.username || "Người dùng"}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email || "Trang cá nhân"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <DropdownItem
              icon={
                <Settings
                  size={18}
                  className="text-gray-500 dark:text-gray-400"
                />
              }
              label="Cài đặt & Quyền riêng tư"
              onClick={() => {
                navigate("/dashboard/settings/privacy");
                onClose();
              }}
            />
            <DropdownItem
              icon={
                <Bell size={18} className="text-gray-500 dark:text-gray-400" />
              }
              label="Thông báo của tôi"
              onClick={() => {
                onShowNotifications();
                onClose();
              }}
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-white/10 my-2 mx-1" />

          <DropdownItem
            icon={<LogOut size={18} />}
            label="Đăng xuất"
            onClick={handleLogout}
            danger
          />
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenuDropdown;
