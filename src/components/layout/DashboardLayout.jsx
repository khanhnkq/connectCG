import UserNavbar from "./UserNavbar";

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-background-main text-text-main font-display overflow-hidden h-screen flex flex-col w-full animate-in fade-in duration-500">
      <UserNavbar />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative w-full mb-16 md:mb-0">
        <div className="hidden md:flex h-full">
          <Sidebar />
        </div>
        <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-main transition-colors duration-300">
          <Outlet />
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
