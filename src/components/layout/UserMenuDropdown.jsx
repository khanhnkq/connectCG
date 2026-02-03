import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Bell, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-72 bg-surface-main border border-border-main rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
        >
          {/* Profile Header */}
          <div
            className="p-3 mb-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => {
              navigate("/dashboard/my-profile");
              onClose();
            }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-primary to-orange-400 p-[2px] rounded-full">
                <img
                  src={
                    userProfile?.currentAvatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#1C1C1E]"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate text-sm">
                  {userProfile?.fullName || user?.username || "Người dùng"}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenuDropdown;
