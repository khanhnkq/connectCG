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
  Sun,
  Moon,
  ShieldCheck,

  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { findMyGroups } from "../../services/groups/GroupService";

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

  // Groups Logic
  const [myGroups, setMyGroups] = useState([]);
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showManaged, setShowManaged] = useState(true);
  const [showJoined, setShowJoined] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;
      try {
        const response = await findMyGroups(0, 50); // Fetch up to 50 groups
        const groups = response.content || response || [];
        setMyGroups(groups);

        // Filter groups
        const managed = [];
        const joined = [];

        groups.forEach(g => {
          const isManager = g.ownerId === user.id || g.currentUserRole === "ADMIN";
          if (isManager) managed.push(g);
          else joined.push(g);
        });

        setManagedGroups(managed);
        setJoinedGroups(joined);
      } catch (error) {
        console.error("Failed to fetch sidebar groups", error);
      }
    };
    fetchGroups();
  }, [user?.id]);

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
    // Redundant items removed (Home, Friends, Groups, Search)
    // Sidebar now serves for utilities and admin features
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
          {/* Profile Section at Top */}
          <div className="mb-6">
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
                    className="h-7 w-7 min-w-7 min-h-7 flex-shrink-0 !rounded-full object-cover aspect-square border border-border-main"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {menuItems.map((link, idx) => (
              <div key={idx}>
                <SidebarLink link={link} />
              </div>
            ))}

            <div className="my-2 border-t border-border-main/50" />

            {/* Managed Groups */}
            {managedGroups.length > 0 && (
              <div className="mb-2">
                {open ? (
                  <button
                    onClick={() => setShowManaged(!showManaged)}
                    className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors mb-1"
                  >
                    <span>Quản lý nhóm</span>
                    {showManaged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : (
                  <div className="h-4" /> // Spacer when collapsed
                )}

                {showManaged && managedGroups.map(group => (
                  <SidebarLink
                    key={group.id}
                    link={{
                      label: group.name,
                      href: `/dashboard/groups/${group.id}`,
                      icon: (
                        <div className="relative">
                          <img
                            src={group.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"}
                            alt={group.name}
                            className="h-6 w-6 !rounded-lg object-cover flex-shrink-0 border border-border-main"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-[2px] border border-background-main">
                            <ShieldCheck size={8} className="text-white" />
                          </div>
                        </div>
                      )
                    }}
                  />
                ))}
              </div>
            )}

            {/* Joined Groups */}
            {joinedGroups.length > 0 && (
              <div className="mb-2">
                {open ? (
                  <button
                    onClick={() => setShowJoined(!showJoined)}
                    className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors mb-1"
                  >
                    <span>Nhóm tham gia</span>
                    {showJoined ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                ) : (
                  <div className="h-4" />
                )}

                {showJoined && joinedGroups.map(group => (
                  <SidebarLink
                    key={group.id}
                    link={{
                      label: group.name,
                      href: `/dashboard/groups/${group.id}`,
                      icon: (
                        <img
                          src={group.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"}
                          alt={group.name}
                          className="h-6 w-6 !rounded-lg object-cover flex-shrink-0 border border-border-main"
                        />
                      )
                    }}
                  />
                ))}
              </div>
            )}

            <div className="my-2 border-t border-border-main/50" />

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
