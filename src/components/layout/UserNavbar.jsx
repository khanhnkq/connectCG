import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  Home,
  Users,
  UsersRound,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";
import NotificationService from "../../services/NotificationService";
import toast from "react-hot-toast";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import UserMenuDropdown from "./UserMenuDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ChatDropdownWrapper from "./ChatDropdownWrapper";

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const notificationRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Global Chat Listener
  useEffect(() => {
    if (!user?.id) return;

    const listeners = [];
    const startTime = Date.now();

    const setupChatListener = async () => {
      try {
        const ChatService = (await import("../../services/chat/ChatService"))
          .default;
        const FirebaseChatService = (
          await import("../../services/chat/FirebaseChatService")
        ).default;

        const response = await ChatService.getMyChatRooms();
        const rooms = response.data || [];

        rooms.forEach((room) => {
          const unsub = FirebaseChatService.subscribeToMessages(
            room.firebaseRoomKey,
            (newMsg) => {
              const isNew =
                newMsg.timestamp && newMsg.timestamp > startTime - 10000;
              const isNotMe = newMsg.senderId !== user.id;

              if (isNew && isNotMe) {
                setUnreadChatCount((prev) => prev + 1);
              }
            },
          );
          listeners.push(unsub);
        });
      } catch (err) {
        console.error("Global chat listener failed:", err);
      }
    };

    setupChatListener();

    return () => {
      listeners.forEach((u) => u());
    };
  }, [user?.id]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(
        `/search/members?keyword=${encodeURIComponent(searchTerm.trim())}`,
      );
      setSearchTerm("");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      dispatch(markAsRead(id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      dispatch(deleteNotification(id));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo");
    }
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
      // Mark each notification as read individually
      await Promise.all(
        unreadNotifications.map((notification) =>
          NotificationService.markAsRead(notification.id),
        ),
      );

      // Update Redux state
      dispatch(markAllAsRead());
      toast.success("Đã đánh dấu tất cả đã đọc", { id: tid });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc", { id: tid });
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full px-4 md:px-6 py-2 bg-background-main/80 backdrop-blur-xl border-b border-border-main flex items-center justify-between"
    >
      {/* LEFT: Logo & Search */}
      <div className="flex items-center gap-4 flex-1">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard/feed")}
        >
          <img
            src="/logo.png"
            className="h-9 w-auto object-contain flex-shrink-0"
            alt="Connect Logo"
          />
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex relative w-full max-w-[240px] lg:max-w-[320px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-[#F0F2F5] dark:bg-[#3A3B3C] text-text-main placeholder-text-secondary focus:outline-none focus:ring-0 sm:text-sm transition-all shadow-inner"
            placeholder="Tìm kiếm trên Connect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* CENTER: Primary Navigation */}
      <div className="hidden md:flex items-center justify-center gap-2 lg:gap-8 flex-1">
        <NavItem
          icon={
            <Home size={28} strokeWidth={isActive("/dashboard/feed") ? 3 : 2} />
          }
          active={isActive("/dashboard/feed")}
          onClick={() => {
            navigate("/dashboard/feed");
            setShowNotifications(false);
          }}
          tooltip="Trang chủ"
        />
        <NavItem
          icon={
            <Users
              size={26}
              strokeWidth={isActive("/dashboard/friends") ? 2.8 : 2}
            />
          }
          active={isActive("/dashboard/friends")}
          onClick={() => {
            navigate("/dashboard/friends");
            setShowNotifications(false);
          }}
          tooltip="Bạn bè"
        />
        <NavItem
          icon={
            <UsersRound
              size={26}
              strokeWidth={isActive("/dashboard/groups") ? 2.8 : 2}
            />
          }
          active={isActive("/dashboard/groups")}
          onClick={() => {
            navigate("/dashboard/groups");
            setShowNotifications(false);
          }}
          tooltip="Nhóm"
        />
      </div>

      {/* RIGHT: User Actions */}
      <div className="flex items-center justify-end gap-2 md:gap-3 flex-1">
        {/* Mobile Search Icon */}
        <button
          className="md:hidden p-2 rounded-full text-text-secondary hover:bg-surface-main transition-colors"
          onClick={() => navigate("/search/members")}
        >
          <Search className="h-6 w-6" />
        </button>

        {/* Messenger/Chat */}

        {/* Messenger/Chat Dropdown */}
        <div className="relative" ref={chatDropdownRef}>
          <button
            className={`p-2.5 rounded-full transition-colors relative flex items-center justify-center w-10 h-10 ${
              showChatDropdown
                ? "bg-primary/20 text-primary"
                : "bg-[#E4E6EB] dark:bg-[#3A3B3C] text-text-main hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50]"
            }`}
            onClick={() => {
              setShowChatDropdown(!showChatDropdown);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
          >
            <MessageCircle size={20} weight="fill" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background-main">
                {unreadChatCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <ChatDropdownWrapper
            isOpen={showChatDropdown}
            onClose={() => setShowChatDropdown(false)}
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className={`p-2.5 rounded-full transition-colors relative flex items-center justify-center w-10 h-10 ${
              showNotifications
                ? "bg-primary/20 text-primary"
                : "bg-[#E4E6EB] dark:bg-[#3A3B3C] text-text-main hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50]"
            }`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} weight="fill" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background-main">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        {/* Theme Toggle - Animated */}
        <AnimatedThemeToggler />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowChatDropdown(false);
            }}
            className={`flex items-center gap-1.5 p-1 rounded-full transition-all duration-200 border ml-1 ${
              showUserMenu
                ? "bg-primary/10 border-primary/30"
                : "bg-[#E4E6EB] dark:bg-[#3A3B3C] border-transparent hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50]"
            }`}
          >
            <div className="bg-gradient-to-tr from-primary to-orange-400 p-[2px] rounded-full">
              <img
                src={
                  userProfile?.currentAvatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="User"
                className="w-7 h-7 rounded-full object-cover border-2 border-white dark:border-[#1C1C1E]"
              />
            </div>
            <ChevronDown
              size={14}
              className={`text-text-secondary transition-transform duration-200 mr-1 ${
                showUserMenu ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          <UserMenuDropdown
            isOpen={showUserMenu}
            onClose={() => setShowUserMenu(false)}
            onShowNotifications={() => setShowNotifications(true)}
          />
        </div>
      </div>
    </motion.div>
  );
};

const NavItem = ({ icon, active, onClick, tooltip }) => {
  return (
    <div className="relative group/tooltip">
      <button
        onClick={onClick}
        className={`relative flex items-center justify-center p-3 lg:px-10 lg:py-3.5 rounded-xl transition-all duration-300
                    ${
                      active
                        ? "text-primary bg-primary/5"
                        : "text-text-secondary hover:bg-surface-main hover:text-text-main"
                    }
                `}
      >
        {icon}

        {/* Active Indicator */}
        {active && (
          <motion.div
            layoutId="navbar-active"
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full mx-4"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </button>
      {tooltip && (
        <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-50 pointer-events-none transform translate-y-1 group-hover/tooltip:translate-y-0">
          {tooltip}
        </span>
      )}
    </div>
  );
};
export default UserNavbar;
