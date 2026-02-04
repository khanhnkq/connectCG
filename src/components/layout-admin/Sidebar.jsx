import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  Eye,
  Network,
} from "lucide-react";
import UserProfileService from "../../services/user/UserProfileService";

const iconMap = {
  dashboard: LayoutDashboard,
  group: Users,
  person: Users,
  article: FileText,
  analytics: BarChart3,
  settings: Settings,
};

const Sidebar = ({ brandName = "Quản trị MXH", activeTab = "Groups" }) => {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          // Initial set from localStorage
          setCurrentUser(user);

          // Fetch full profile to get fullName and latest avatar
          if (user.id) {
            try {
              const res = await UserProfileService.getUserProfile(user.id);
              if (res.data) {
                setCurrentUser((prev) => ({ ...prev, ...res.data }));
              }
            } catch (err) {
              console.error("Failed to fetch admin profile", err);
            }
          }
        } catch (error) {
          console.error("Failed to parse user data", error);
        }
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    // { name: "Dashboard", label: "Tổng quan", icon: "dashboard", path: "/admin-website" },
    {
      name: "Groups",
      label: "Nhóm",
      icon: "group",
      path: "/admin-website/groups",
    },
    {
      name: "Users",
      label: "Thành viên",
      icon: "person",
      path: "/admin-website/members",
    },
    {
      name: "Content",
      label: "Nội dung",
      icon: "article",
      path: "/admin-website/contents",
    },
    {
      name: "Reports",
      label: "Báo cáo",
      icon: "analytics",
      path: "/admin-website/reports",
    },
  ];

  const systemItems = [
    { name: "Settings", label: "Cài đặt", icon: "settings", path: "#" },
  ];

  return (
    <aside className="w-72 flex flex-col h-full max-h-screen bg-surface-main z-20 transition-all duration-300 overflow-hidden">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-primary rounded-2xl size-12 flex items-center justify-center text-[#231810] shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
          <Network className="font-extrabold" size={28} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold leading-none tracking-tight text-text-main uppercase">
            {brandName}
          </h1>
          <p className="text-primary text-[10px] uppercase tracking-[0.2em] mt-1.5 font-bold opacity-80">
            Admin Console
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-bold group relative overflow-hidden ${
              activeTab === item.name
                ? "text-[#231810]"
                : "text-text-secondary hover:bg-surface-main/50 hover:text-text-main"
            }`}
          >
            {activeTab === item.name && (
              <div className="absolute inset-0 bg-primary shadow-sm shadow-primary/20 z-0" />
            )}
            <div className="relative z-10 flex items-center gap-3">
              {React.createElement(iconMap[item.icon] || Settings, {
                size: 20,
                className: `transition-transform duration-300 ${
                  activeTab !== item.name ? "group-hover:scale-110" : ""
                }`,
                fill: activeTab === item.name ? "currentColor" : "none",
              })}
              <span className="text-sm">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-6 space-y-4 mt-auto mb-6">
        <Link
          to="/dashboard/feed"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-background-main hover:bg-primary hover:text-[#231810] transition-all font-bold text-xs uppercase tracking-wider text-text-secondary border border-border-main hover:border-transparent group shadow-sm"
        >
          <Eye
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span>Về trang chủ</span>
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 bg-background-main rounded-2xl border border-border-main shadow-sm">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-main"
            style={{
              backgroundImage: `url("${
                currentUser?.currentAvatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }")`,
            }}
          ></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-text-main">
              {currentUser?.fullName || currentUser?.username || "Admin"}
            </p>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider">
              {currentUser?.role || "Quản trị viên"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
