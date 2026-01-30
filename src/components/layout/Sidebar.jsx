import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  Home,
  MessageCircle,
  Users,
  UserCheck,
  Search,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";

export default function SidebarComponent() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const { items: notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const rolesRaw = decoded.role || "";
        const hasAdminRole = rolesRaw.includes("ROLE_ADMIN");
        setIsAdmin(hasAdminRole);
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Trang chủ",
      href: "/dashboard/feed",
      icon: <Home className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tin nhắn",
      href: "/dashboard/chat",
      icon: (
        <MessageCircle className="text-text-secondary h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Bạn bè",
      href: "/dashboard/friends",
      icon: <UserCheck className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Nhóm",
      href: "/dashboard/groups",
      icon: <Users className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tìm kiếm",
      href: "/search/members",
      icon: <Search className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    },
  ];

  // Add Admin Panel if user is admin
  if (isAdmin) {
    menuItems.push({
      label: "Admin Panel",
      href: "/admin-website/groups",

      icon: <Settings className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    });
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-background-main border-r border-border-main transition-colors duration-300">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-4 flex flex-col gap-2">
            {menuItems.map((link, idx) => (
              <div key={idx}>
                <SidebarLink link={link} />
              </div>
            ))}

            <SidebarLink
              link={{
                label: "Đăng xuất",
                onClick: handleLogout,

                icon: (
                  <LogOut className="text-text-secondary h-5 w-5 flex-shrink-0" />
                ),
              }}
            />
            <SidebarLink
              link={{
                label: `Chế độ ${theme === "dark" ? "Sáng" : "Tối"}`,
                onClick: toggleTheme,
                icon:
                  theme === "dark" ? (
                    <Sun className="text-text-secondary h-5 w-5 flex-shrink-0" />
                  ) : (
                    <Moon className="text-text-secondary h-5 w-5 flex-shrink-0" />
                  ),
              }}
            />
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: userProfile?.fullName || user?.username || "StartUP",
              href: "/dashboard/my-profile",
              icon: (
                <img
                  src={
                    userProfile?.currentAvatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="h-7 w-7 min-w-7 min-h-7 flex-shrink-0 !rounded-full object-cover aspect-square"
                  width={28}
                  height={28}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
      <img
        src="/logo.png"
        className="h-7 w-auto object-contain flex-shrink-0"
        alt="Connect Logo"
      />
      <span className="font-medium text-text-main whitespace-pre">
        Connect CG
      </span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <img
        src="/logo.png"
        className="h-7 w-auto object-contain flex-shrink-0"
        alt="Connect Logo"
      />
    </div>
  );
};
