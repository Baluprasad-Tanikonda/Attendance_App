/** @format */

import React from "react";
import SideNavbar from "../sidenavbar/SideNavbar";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <div className="flex h-screen">
      <SideNavbar />
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
