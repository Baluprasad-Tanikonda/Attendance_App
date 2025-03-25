/** @format */

import React from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

const SideNavbar = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`z-10 fixed top-0 left-0 h-full bg-white shadow-lg w-64 p-4 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center justify-center py-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Social Track</h1>
        </div>
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
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
      </div>
    </div>
  );
};

export default SideNavbar;
