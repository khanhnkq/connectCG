import React from "react";
import Sidebar from "../layout/Sidebar";

/**
 * Admin Sidebar wrapper - Delegates to unified Modern Flat Sidebar
 */
const AdminSidebar = ({ activeTab, ...props }) => {
  return <Sidebar variant="admin" activeTab={activeTab} {...props} />;
};

export default AdminSidebar;
