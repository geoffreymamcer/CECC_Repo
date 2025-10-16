// src/components/TopBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoMdTime, IoMdCalendar } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const TopBar = ({ time, date, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    navigate("/cecc-admin-login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-lg">
      <button
        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex items-center space-x-6">
        <div className="flex items-center text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
          <IoMdTime className="mr-2 text-deep-red" />
          <span className="font-medium">{time}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
          <IoMdCalendar className="mr-2 text-deep-red" />
          <span className="font-medium">{date}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-3 rounded-full hover:bg-gray-100 relative transition-all duration-200">
            <FaBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="p-3 rounded-full hover:bg-gray-100 relative transition-all duration-200 flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaUserCircle className="text-xl text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-[#7F0000] transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
