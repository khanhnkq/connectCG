import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MagnifyingGlass,
  Bell,
  House,
  Users,
  UsersThree,
  ChatCircle,
  CaretDown,
  List,
  ShieldCheck,
  ArrowSquareOut,
  FileText,
  ShieldWarning,
} from "@phosphor-icons/react";
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
import { IconButton, Button } from "../ui/button/Button";
import { Avatar } from "../ui/avatar/Avatar";
import { Badge } from "../ui/badge/Badge";
import { ConfirmDialog } from "../ui/modal/ConfirmDialog";
import UserMenuDropdown from "./UserMenuDropdown";
import NotificationDropdown from "./NotificationDropdown";
import ChatDropdownWrapper from "./ChatDropdownWrapper";
import useChatRooms from "../../pages/chat/hooks/useChatRooms";

/**
 * Modern Flat Unified Navbar
 * - Dùng chung cho cả User Dashboard & Admin Website
 * - Phân biệt qua prop variant="user" | "admin"
 * - 0px drop shadow, 0px blur, viền phẳng 1px crisp border
 * - Chuẩn quy tắc nút bấm: icon-only không có chữ, nút có chữ không có icon
 */
export function Navbar({
  variant = "user",
  title,
  brandName = "Connect",
  onMenuClick,
}) {
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

  const { directUnreadCount, groupUnreadCount, fetchRooms } = useChatRooms();
  const totalUnreadChatCount = (directUnreadCount || 0) + (groupUnreadCount || 0);

  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    isOpen: false,
    notificationId: null,
  });

  const notificationRef = useRef(null);
  const chatDropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const isAdminUser = Boolean(user?.role?.includes("ROLE_ADMIN"));

  // Global Chat Listener & Fetching
  useEffect(() => {
    if (!user?.id) return;
    fetchRooms?.();
  }, [user?.id, fetchRooms]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (confirmDialogConfig.isOpen) return;
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
      if (
        showChatDropdown &&
        chatDropdownRef.current &&
        !chatDropdownRef.current.contains(event.target)
      ) {
        setShowChatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showUserMenu, showChatDropdown, confirmDialogConfig.isOpen]);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search/members?keyword=${encodeURIComponent(searchTerm.trim())}`);
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

  const handleConfirmDelete = async () => {
    const id = confirmDialogConfig.notificationId;
    if (!id) return;
    try {
      await NotificationService.deleteNotification(id);
      dispatch(deleteNotification(id));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Không thể xóa thông báo");
    }
    setConfirmDialogConfig({ isOpen: false, notificationId: null });
  };

  const handleDeleteRequest = (id) => {
    setConfirmDialogConfig({
      isOpen: true,
      notificationId: id,
    });
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) {
      toast("Tất cả thông báo đã được đọc");
      return;
    }

    const tid = toast.loading(`Đang đánh dấu ${unreadNotifications.length} thông báo...`);
    try {
      await NotificationService.markAllAsRead();
      dispatch(markAllAsRead());
      toast.success("Đã đánh dấu tất cả đã đọc", { id: tid });
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Không thể đánh dấu tất cả đã đọc", { id: tid });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 px-4 md:px-6 bg-surface-main border-b border-border-main flex items-center justify-between transition-colors">
      {/* 1. LEFT SECTION: Logo & Branding / Global Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={variant === "admin" ? "/admin-website/groups" : "/dashboard/feed"}
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none"
        >
          <img
            src="/logo.png"
            className="h-8 w-auto object-contain shrink-0"
            alt={brandName}
          />
          {variant === "admin" && (
            <Badge variant="primary" size="sm">
              Admin Portal
            </Badge>
          )}
        </Link>

        {/* Admin Title or Desktop Search */}
        {variant === "admin" ? (
          title && (
            <div className="hidden lg:flex items-center pl-4 border-l border-border-main">
              <span className="text-sm font-semibold text-text-secondary truncate">
                {title}
              </span>
            </div>
          )
        ) : (
          <div className="hidden md:flex relative w-full max-w-[240px] lg:max-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <MagnifyingGlass size={16} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3.5 py-2 text-sm rounded-xl bg-surface-subtle border border-border-main text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Tìm kiếm thành viên, bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}
      </div>

      {/* 2. CENTER SECTION: Primary Navigation Tabs */}
      <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-4 flex-1">
        {variant === "admin" ? (
          <>
            <AdminNavLink
              to="/admin-website/groups"
              active={location.pathname.startsWith("/admin-website/groups")}
              label="Nhóm"
              icon={Users}
            />
            <AdminNavLink
              to="/admin-website/members"
              active={location.pathname.startsWith("/admin-website/members")}
              label="Thành viên"
              icon={UsersThree}
            />
            <AdminNavLink
              to="/admin-website/contents"
              active={location.pathname.startsWith("/admin-website/contents")}
              label="Nội dung"
              icon={FileText}
            />
            <AdminNavLink
              to="/admin-website/reports"
              active={location.pathname.startsWith("/admin-website/reports")}
              label="Báo cáo"
              icon={ShieldWarning}
            />
          </>
        ) : (
          <>
            <UserNavLink
              to="/dashboard/feed"
              active={isActive("/dashboard/feed")}
              tooltip="Bảng tin"
              icon={House}
            />
            <UserNavLink
              to="/dashboard/friends"
              active={isActive("/dashboard/friends")}
              tooltip="Bạn bè"
              icon={Users}
            />
            <UserNavLink
              to="/dashboard/groups"
              active={isActive("/dashboard/groups")}
              tooltip="Cộng đồng"
              icon={UsersThree}
            />
            <UserNavLink
              to="/dashboard/chat"
              active={isActive("/dashboard/chat")}
              tooltip="Tin nhắn"
              icon={ChatCircle}
              badge={totalUnreadChatCount}
            />
          </>
        )}
      </nav>

      {/* 3. RIGHT SECTION: User Actions */}
      <div className="flex items-center justify-end gap-2 md:gap-2.5 flex-1 shrink-0">
        {/* Mobile Search Button */}
        {variant === "user" && (
          <IconButton
            icon={MagnifyingGlass}
            variant="ghost"
            size="md"
            className="md:hidden"
            aria-label="Tìm kiếm"
            onClick={() => navigate("/search/members")}
          />
        )}

        {/* Portal Switcher */}
        {variant === "admin" ? (
          <Link to="/dashboard/feed" className="hidden sm:inline-block">
            <Button variant="outline" size="sm">
              Về Bảng tin
            </Button>
          </Link>
        ) : (
          isAdminUser && (
            <div className="hidden sm:block">
              <IconButton
                icon={ShieldCheck}
                variant="ghost"
                size="md"
                aria-label="Trang quản trị"
                onClick={() => navigate("/admin-website/groups")}
              />
            </div>
          )
        )}

        {/* Chat Dropdown Toggle */}
        <div className="hidden md:block relative" ref={chatDropdownRef}>
          <div className="relative">
            <IconButton
              icon={ChatCircle}
              variant={showChatDropdown ? "secondary" : "ghost"}
              size="md"
              aria-label="Hộp thư chat"
              onClick={() => {
                setShowChatDropdown(!showChatDropdown);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
            />
            {totalUnreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white pointer-events-none">
                {totalUnreadChatCount > 99 ? "99+" : totalUnreadChatCount}
              </span>
            )}
          </div>

          <ChatDropdownWrapper
            isOpen={showChatDropdown}
            onClose={() => setShowChatDropdown(false)}
          />
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative" ref={notificationRef}>
          <div className="relative">
            <IconButton
              icon={Bell}
              variant={showNotifications ? "secondary" : "ghost"}
              size="md"
              aria-label="Thông báo"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowChatDropdown(false);
                setShowUserMenu(false);
              }}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white pointer-events-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteRequest}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        {/* Animated Theme Toggler */}
        <div className="hidden sm:block">
          <AnimatedThemeToggler />
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowChatDropdown(false);
            }}
            aria-label="Tài khoản cá nhân"
            className={`flex items-center gap-1.5 p-1 rounded-xl border transition-colors cursor-pointer ${
              showUserMenu
                ? "bg-surface-subtle border-primary"
                : "border-transparent hover:bg-surface-subtle"
            }`}
          >
            <Avatar
              src={userProfile?.currentAvatarUrl}
              name={userProfile?.fullName || user?.username || "U"}
              size="sm"
            />
            <CaretDown
              size={12}
              className={`text-text-muted transition-transform duration-150 ${
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

        {/* Mobile Menu Drawer Button */}
        {onMenuClick && (
          <IconButton
            icon={List}
            variant="ghost"
            size="md"
            className="md:hidden"
            aria-label="Menu"
            onClick={onMenuClick}
          />
        )}
      </div>

      {/* Confirm Delete Notification Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogConfig.isOpen}
        title="Xóa thông báo?"
        message="Bạn có chắc chắn muốn xóa thông báo này không?"
        confirmText="Xóa thông báo"
        cancelText="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() =>
          setConfirmDialogConfig({ ...confirmDialogConfig, isOpen: false })
        }
      />
    </header>
  );
}

/**
 * User Center Nav Item (Icon-only with active flat bottom underline)
 */
function UserNavLink({ to, active, tooltip, icon: Icon, badge }) {
  return (
    <Link
      to={to}
      title={tooltip}
      aria-label={tooltip}
      className={`relative flex items-center justify-center p-3 lg:px-6 rounded-xl transition-colors ${
        active
          ? "text-primary bg-primary/10"
          : "text-text-secondary hover:text-text-main hover:bg-surface-subtle"
      }`}
    >
      <Icon size={22} weight={active ? "fill" : "regular"} />
      {badge > 0 && (
        <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-danger" />
      )}
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-t-full" />
      )}
    </Link>
  );
}

/**
 * Admin Center Nav Item (Text-only tab, strictly adheres to button/link rules)
 */
function AdminNavLink({ to, active, label }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
        active
          ? "text-primary bg-primary/10"
          : "text-text-secondary hover:text-text-main hover:bg-surface-subtle"
      }`}
    >
      <span>{label}</span>
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-t-full" />
      )}
    </Link>
  );
}

export default Navbar;
