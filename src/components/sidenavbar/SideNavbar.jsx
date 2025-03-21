/** @format */

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

const SideNavbar = () => {

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Brand Logo */}
      <div className="flex items-center justify-center py-6 border-b">
        <h1 className="text-xl font-bold text-indigo-600">Social Track</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `w-full flex items-center p-3 rounded-lg ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              <FaChalkboardTeacher className="mr-3" />
              Batches
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full flex items-center p-3 rounded-lg ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              <FaUserGraduate className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `w-full flex items-center p-3 rounded-lg ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              <FaChartBar className="mr-3" />
              Attendance
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Admin Section */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            A
          </div>
          <span className="ml-3 text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
