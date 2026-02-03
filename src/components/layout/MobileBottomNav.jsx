import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, UsersRound, MessageCircle, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import useChatRooms from "../../pages/chat/hooks/useChatRooms";

export default function MobileBottomNav({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Chat unread count
  const { directUnreadCount, groupUnreadCount } = useChatRooms();
  const totalUnreadChatCount = directUnreadCount + groupUnreadCount;

  // Function to check if path is active
  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/dashboard/feed",
      onClick: () => navigate("/dashboard/feed"),
    },
    {
      icon: Users,
      label: "Bạn bè",
      path: "/dashboard/friends",
      onClick: () => navigate("/dashboard/friends"),
    },
    {
      icon: UsersRound,
      label: "Nhóm",
      path: "/dashboard/groups",
      onClick: () => navigate("/dashboard/groups"),
    },
    {
      icon: MessageCircle,
      label: "Chat",
      path: "/dashboard/chat",
      onClick: () => navigate("/dashboard/chat"),
      badge: totalUnreadChatCount,
    },
    {
      icon: Menu,
      label: "Menu",
      path: "#menu",
      onClick: onMenuClick, // Trigger drawer
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-main border-t border-border-main pb-safe safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            isActive(item.path) || (item.label === "Menu" && false); // Menu is never "active" route

          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center w-full h-full relative group transition-colors ${
                active
                  ? "text-primary"
                  : "text-text-secondary hover:text-text-main"
              }`}
            >
              <div className="relative p-1.5 rounded-xl">
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <Icon
                  size={24}
                  strokeWidth={active ? 2.8 : 2}
                  className={`transition-transform duration-200 ${
                    active ? "scale-105" : ""
                  }`}
                />

                {/* Badge for Chat */}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background-main">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              {/* Optional: Label (can be hidden for cleaner look, or shown) */}
              {/* <span className={`text-[10px] font-medium mt-0.5 ${active ? "text-primary" : ""}`}>
                {item.label}
              </span> */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
