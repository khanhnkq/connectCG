import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * Modern Flat Admin Layout
 * Top Navbar across full width + Left Sidebar underneath
 */
const AdminLayout = ({ children, title, activeTab, brandName }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-background-main text-text-main font-display overflow-hidden">
      {/* Top Navbar */}
      <Header title={title} brandName={brandName} />

      {/* Workspace Area: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative w-full">
        <Sidebar activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-background-main transition-colors duration-300 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
