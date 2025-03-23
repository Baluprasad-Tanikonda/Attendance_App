/** @format */
import React from "react";
import SideNavbar from "../sidenavbar/SideNavbar";
import { Outlet, useLocation } from "react-router-dom";

const PageLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname.includes("/attendanceForm");

  return (
    <div className="flex h-screen">
      {!hideSidebar && <SideNavbar />}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
