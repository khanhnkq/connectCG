import UserNavbar from "./UserNavbar";

import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useWebSocket } from "../../context/WebSocketContext";
import PageLoadingFallback from "../common/PageLoadingFallback";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isConnected } = useWebSocket();

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-website");

  return (
    <div className="bg-background-main text-text-main font-display overflow-hidden h-screen flex flex-col w-full animate-in fade-in duration-500">
      <UserNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      {!isConnected && (
        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium z-40">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Mất kết nối máy chủ thời gian thực. Đang kết nối lại...</span>
        </div>
      )}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative w-full mb-16 md:mb-0">
        {!isAdminRoute && (
          <div className="hidden md:flex h-full">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-main transition-colors duration-300">
          <Suspense fallback={<PageLoadingFallback fullScreen={false} />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileBottomNav onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
