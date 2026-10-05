import React from "react";
import Navbar from "../layout/Navbar";

/**
 * Admin Header wrapper - Delegates to unified Modern Flat Navbar
 */
const Header = ({ title = "Quản lý", brandName = "Connect Admin", ...props }) => {
  return <Navbar variant="admin" title={title} brandName={brandName} {...props} />;
};

export default Header;
