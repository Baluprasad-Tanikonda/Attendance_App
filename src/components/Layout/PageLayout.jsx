/** @format */
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNavbar from "../sidenavbar/SideNavbar";
import { Menu } from "lucide-react";

const PageLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname.includes("/attendanceForm");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Toggle Button */}
      {!hideSidebar && (
        <button
          className="absolute top-4 left-4 z-50 md:hidden bg-gray-200 p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      {!hideSidebar && <SideNavbar isOpen={isOpen} setIsOpen={setIsOpen} />}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
