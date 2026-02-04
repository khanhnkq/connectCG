import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children, title, activeTab, brandName }) => {
  return (
    <div className="flex h-screen w-full bg-background-main text-text-main font-display overflow-hidden">
      <Sidebar brandName={brandName} activeTab={activeTab} />
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header title={title} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 bg-background-main transition-colors duration-300 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
