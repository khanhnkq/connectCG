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

const iconMap = {
  dashboard: LayoutDashboard,
  group: Users,
  person: Users,
  article: FileText,
  analytics: BarChart3,
  settings: Settings,
};

const Sidebar = ({ brandName = "Quản trị MXH", activeTab = "Groups" }) => {
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
    <aside className="w-72 flex flex-col border-r border-border-dark bg-background-dark">
      <div className="p-8 flex items-center gap-4">
        <div className="bg-primary rounded-xl size-10 flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Network className="font-bold" size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-none tracking-tight">
            {brandName}
          </h1>
          <p className="text-text-muted text-[10px] uppercase tracking-widest mt-1 font-semibold">
            Cổng quản lý
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all group ${
              activeTab === item.name
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-text-muted hover:bg-surface-dark hover:text-white"
            }`}
          >
            {React.createElement(iconMap[item.icon] || Settings, {
              size: 22,
              className: `transition-transform ${
                activeTab !== item.name ? "group-hover:scale-110" : ""
              }`,
              fill: activeTab === item.name ? "currentColor" : "none",
            })}
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ))}

        <div className="pt-8 px-5 pb-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Hệ thống
          </p>
        </div>

        {systemItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all group ${
              activeTab === item.name
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-text-muted hover:bg-surface-dark hover:text-white"
            }`}
          >
            {React.createElement(iconMap[item.icon] || Settings, {
              size: 22,
              className: `transition-transform ${
                activeTab !== item.name ? "group-hover:scale-110" : ""
              }`,
            })}
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-border-dark space-y-4">
        <Link
          to="/dashboard/feed"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest border border-orange-500/20"
        >
          <Eye size={18} />
          Xem trang chủ
        </Link>
        <div className="flex items-center gap-4 px-2 py-2 bg-surface-dark/50 rounded-2xl border border-border-dark">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-10 border-2 border-primary/20"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkk7o-V6MRkzcD_ohHAHXUpIzMzDnRKH10CGPitsuwRBpt70Riyy7LYdUw8BLx_hX4lOXOZtFeghgV_ezLof0gRFhhJU9uk0sLh4YrGxII1Vu3qDKhA-HpFZP2AicxO7HWGWsQFxBzFrBNvOBtAdQcUXUHLOleW6GZnmXWQoKp5WKDmRgqHCZVnUN5_8UlrMBbNwIUDL3apjXyC_b4MjW6OY58803uBwVD8sc_tIrkTm8EMfuPoObCHSnTTG7_eHvEB_wAl6SGwWg")',
            }}
          ></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Alex Rivera</p>
            <p className="text-text-muted text-[10px] uppercase font-bold tracking-wider">
              Quản trị viên
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
