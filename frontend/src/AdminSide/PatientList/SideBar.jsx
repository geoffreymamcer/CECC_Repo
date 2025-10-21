// src/components/SideBar.jsx
import React from "react";
import {
  FaChartLine,
  FaCalendarAlt,
  FaBox,
  FaEye,
  FaHeartbeat,
} from "react-icons/fa";
import { MdDashboard, MdPeople } from "react-icons/md";

const SideBar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { name: "Dashboard", icon: <MdDashboard className="text-xl" /> },
    { name: "Patient List", icon: <MdPeople className="text-xl" /> },
    { name: "Patient Analytics", icon: <FaChartLine className="text-xl" /> },
    { name: "Financial Reports", icon: <FaChartLine className="text-xl" /> },

    { name: "Appointments", icon: <FaCalendarAlt className="text-xl" /> },
    { name: "Inventory", icon: <FaBox className="text-xl" /> },
    { name: "Color Vision Test", icon: <FaEye className="text-xl" /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-deep-red to-dark-red text-white transition-all duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative shadow-xl`}
    >
      <div className="flex items-center justify-center h-20 px-4 bg-dark-red border-b border-red-900">
        <div className="flex items-center">
          <FaHeartbeat className="text-2xl mr-2" />
          <div className="text-xl font-bold tracking-wider">
            Candelaria Eye Care Clinic
          </div>
        </div>
      </div>
      <nav className="mt-8 px-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center w-full px-4 py-4 my-1 text-left rounded-xl transition-all duration-200 hover:bg-red-800 ${
              activeTab === item.name ? "bg-red-800 shadow-inner" : ""
            }`}
            onClick={() => {
              setActiveTab(item.name);
              setSidebarOpen(false);
            }}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 text-center text-sm text-gray-200">
        <p>© 2025 Candelaria Eye Care Clinic</p>
        <p className="text-xs mt-1">v2.4.1</p>
      </div>
    </div>
  );
};

export default SideBar;
