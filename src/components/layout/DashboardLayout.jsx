import UserNavbar from "./UserNavbar";

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="bg-background-main text-text-main font-display overflow-hidden h-screen flex flex-col md:flex-row w-full animate-in fade-in duration-500">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-main transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
}
