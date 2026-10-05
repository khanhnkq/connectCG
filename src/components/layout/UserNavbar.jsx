import React from "react";
import Navbar from "./Navbar";

/**
 * UserNavbar wrapper - Delegates to unified Modern Flat Navbar
 */
const UserNavbar = (props) => {
  return <Navbar variant="user" {...props} />;
};

export default UserNavbar;
