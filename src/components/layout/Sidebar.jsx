import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";

export default function SidebarComponent() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Track location in a ref so the listener can access it without re-subscribing
  const locationRef = React.useRef(location.pathname);
  useEffect(() => {
    locationRef.current = location.pathname;
    // Reset unread count when entering chat page
    if (location.pathname === "/dashboard/chat") {
      setUnreadChatCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Global Chat Listener for unread messages
  useEffect(() => {
    if (!user?.id) return;

    const listeners = [];
    const startTime = Date.now();
    const roomsKey = `last_read_${user.id}`;

    // Helper to get my chat rooms and subscribe
    const setupChatListener = async () => {
      try {
        const ChatService = (await import("../../services/chat/ChatService")).default;
        const FirebaseChatService = (await import("../../services/chat/FirebaseChatService")).default;

        const response = await ChatService.getMyChatRooms();
        const rooms = response.data || [];

        // Initialize unread count from backend
        const initialUnread = rooms.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
        setUnreadChatCount(initialUnread);

        rooms.forEach((room) => {
          const unsub = FirebaseChatService.subscribeToMessages(
            room.firebaseRoomKey,
            (newMsg) => {
              // Only count as unread if it's NEW and NOT from me
              const isNew = newMsg.timestamp && newMsg.timestamp > startTime - 10000;
              const isNotMe = newMsg.senderId != user.id;

              if (isNew && isNotMe) {
                // Show indicator regardless of page (User can clear it by going to Chat)
                setUnreadChatCount((prev) => prev + 1);
              }
            },
            1 // Only need the latest message for the notification dot
          );
          listeners.push(unsub);
        });
      } catch (err) {
        console.error("Global chat listener failed:", err);
      }
    };

    setupChatListener();

    return () => {
      listeners.forEach(u => u());
    };
  }, [user?.id]);


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
        <div className="relative">
          <MessageCircle className="text-text-secondary h-5 w-5 flex-shrink-0" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          )}
        </div>
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
