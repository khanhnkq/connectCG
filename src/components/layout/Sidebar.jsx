import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  House,
  Users,
  UsersThree,
  ChatCircle,
  User,
  ShieldCheck,
  Gear,
  FileText,
  ShieldWarning,
  ArrowLeft,
  CaretLeft,
  CaretRight,
  CaretDown,
  SignOut,
  Plus,
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { logout } from "../../redux/slices/authSlice";
import { findMyGroups } from "../../services/groups/GroupService";
import { Avatar } from "../ui/avatar/Avatar";
import { IconButton } from "../ui/button/Button";
import { Badge } from "../ui/badge/Badge";
import toast from "react-hot-toast";

/**
 * Modern Flat Unified Sidebar
 * - Dùng chung cho cả User & Admin (variant="user" | "admin")
 * - Hỗ trợ thu gọn (icon-only 72px) và mở rộng (full 256px)
 * - 0px shadow, 0px blur, 1px crisp border
 * - Chuẩn quy tắc nút bấm: icon-only không có chữ, có chữ không có icon
 */
export function Sidebar({
  variant = "user",
  defaultCollapsed = false,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  activeTab,
  className = "",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setInternalCollapsed(nextState);
    onToggleCollapse?.(nextState);
  };

  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const isAdmin = Boolean(user?.role?.includes("ROLE_ADMIN"));

  // Groups state (User mode)
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showManaged, setShowManaged] = useState(true);
  const [showJoined, setShowJoined] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  useEffect(() => {
    if (variant !== "user" || !user?.id) return;

    let isMounted = true;
    const fetchGroups = async () => {
      try {
        const response = await findMyGroups(0, 50);
        if (!isMounted) return;
        const groups = response?.content || response || [];

        const managed = [];
        const joined = [];

        groups.forEach((g) => {
          const isManager =
            g.ownerId === user.id || g.currentUserRole === "ADMIN";
          if (isManager) managed.push(g);
          else joined.push(g);
        });

        setManagedGroups(managed);
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Failed to fetch sidebar groups", err);
      }
    };

    fetchGroups();
    return () => {
      isMounted = false;
    };
  }, [user?.id, variant]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // Ignored
    } finally {
      navigate("/login");
    }
  };

  const isActive = (path) => {
    if (activeTab) {
      return location.pathname.includes(activeTab.toLowerCase());
    }
    return location.pathname === path;
  };

  // Nav item lists
  const userNavItems = [
    { label: "Bảng tin", path: "/dashboard/feed", icon: House },
    { label: "Bạn bè", path: "/dashboard/friends", icon: Users },
    { label: "Nhóm cộng đồng", path: "/dashboard/groups", icon: UsersThree },
    { label: "Tin nhắn", path: "/dashboard/chat", icon: ChatCircle },
    { label: "Trang cá nhân", path: "/dashboard/my-profile", icon: User },
    { label: "Quyền riêng tư", path: "/dashboard/settings/privacy", icon: ShieldCheck },
  ];

  if (isAdmin) {
    userNavItems.push({
      label: "Trang quản trị",
      path: "/admin-website/groups",
      icon: Gear,
      isAdminBadge: true,
    });
  }

  const adminNavItems = [
    { label: "Quản lý nhóm", path: "/admin-website/groups", icon: Users },
    { label: "Quản lý thành viên", path: "/admin-website/members", icon: UsersThree },
    { label: "Nội dung & Bài viết", path: "/admin-website/contents", icon: FileText },
    { label: "Xử lý báo cáo", path: "/admin-website/reports", icon: ShieldWarning },
    { label: "Về Bảng tin", path: "/dashboard/feed", icon: ArrowLeft, isDividerBefore: true },
  ];

  const currentNavItems = variant === "admin" ? adminNavItems : userNavItems;

  return (
    <aside
      className={`h-full flex flex-col shrink-0 bg-surface-main border-r border-border-main select-none transition-[width] duration-200 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
    >
      {/* 1. TOP HEADER & COLLAPSE TOGGLE */}
      <div className="h-12 px-3 border-b border-border-main flex items-center justify-between shrink-0">
        {!isCollapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-2">
            {variant === "admin" ? "Bảng điều khiển" : "Menu chính"}
          </span>
        )}
        <div className={isCollapsed ? "mx-auto" : "ml-auto"}>
          <IconButton
            icon={isCollapsed ? CaretRight : CaretLeft}
            variant="ghost"
            size="sm"
            aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            onClick={toggleCollapse}
          />
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION LIST */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 custom-scrollbar">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <React.Fragment key={item.path}>
              {item.isDividerBefore && (
                <div className="my-2 border-t border-border-main" />
              )}
              <Link
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-subtle"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  size={20}
                  weight={active ? "fill" : "regular"}
                  className="shrink-0"
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.isAdminBadge && (
                  <Badge variant="primary" size="sm">
                    Admin
                  </Badge>
                )}
              </Link>
            </React.Fragment>
          );
        })}

        {/* 3. USER GROUPS SECTION (User mode only) */}
        {variant === "user" && !isCollapsed && (
          <div className="mt-4 pt-4 border-t border-border-main space-y-3">
            {/* Managed Groups */}
            <div>
              <button
                type="button"
                onClick={() => setShowManaged(!showManaged)}
                className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold text-text-muted uppercase tracking-wider hover:text-text-main transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-primary" />
                  Nhóm quản lý ({managedGroups.length})
                </span>
                <CaretDown
                  size={12}
                  className={`transition-transform duration-150 ${
                    showManaged ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {showManaged && (
                <div className="mt-1 space-y-0.5">
                  {managedGroups.length === 0 ? (
                    <p className="px-3 py-1.5 text-xs text-text-muted italic">
                      Chưa có nhóm nào
                    </p>
                  ) : (
                    managedGroups.slice(0, 5).map((g) => (
                      <Link
                        key={g.id}
                        to={`/dashboard/groups/${g.id}`}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-main hover:bg-surface-subtle transition-colors truncate"
                      >
                        <Avatar src={g.avatarUrl} name={g.name} size="sm" />
                        <span className="truncate">{g.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Joined Groups */}
            <div>
              <button
                type="button"
                onClick={() => setShowJoined(!showJoined)}
                className="flex items-center justify-between w-full px-2 py-1 text-xs font-bold text-text-muted uppercase tracking-wider hover:text-text-main transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <UsersThree size={14} className="text-primary" />
                  Nhóm tham gia ({joinedGroups.length})
                </span>
                <CaretDown
                  size={12}
                  className={`transition-transform duration-150 ${
                    showJoined ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {showJoined && (
                <div className="mt-1 space-y-0.5">
                  {joinedGroups.length === 0 ? (
                    <p className="px-3 py-1.5 text-xs text-text-muted italic">
                      Chưa tham gia nhóm nào
                    </p>
                  ) : (
                    joinedGroups.slice(0, 5).map((g) => (
                      <Link
                        key={g.id}
                        to={`/dashboard/groups/${g.id}`}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-main hover:bg-surface-subtle transition-colors truncate"
                      >
                        <Avatar src={g.avatarUrl} name={g.name} size="sm" />
                        <span className="truncate">{g.name}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM USER FOOTER */}
      <div className="p-2 border-t border-border-main shrink-0 bg-surface-subtle/40">
        {isCollapsed ? (
          <div className="flex justify-center">
            <IconButton
              icon={SignOut}
              variant="ghost"
              size="sm"
              aria-label="Đăng xuất"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-surface-main border border-border-main">
            <Link
              to="/dashboard/my-profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={userProfile?.currentAvatarUrl}
                name={userProfile?.fullName || user?.username || "U"}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text-main truncate">
                  {userProfile?.fullName || user?.username || "Người dùng"}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {isAdmin ? "Quản trị viên" : "Thành viên"}
                </p>
              </div>
            </Link>

            <IconButton
              icon={SignOut}
              variant="ghost"
              size="sm"
              aria-label="Đăng xuất"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
