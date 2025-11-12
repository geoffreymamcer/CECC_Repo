// src/components/TopBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoMdTime, IoMdCalendar } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import instance from "../../api/axios";

const TopBar = ({ time, date, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth(); // Get user and logout from context
  const socket = useSocket(); // Get the socket instance

  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Fetch initial notifications when the component mounts
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const res = await instance.get("/notifications/my-notifications");
          setNotifications(res.data);
          setHasUnread(res.data.some((n) => !n.isRead));
        } catch (err) {
          console.error("Could not fetch notifications", err);
        }
      };
      fetchNotifications();
    }
  }, [user]);

  // Listen for real-time notifications from the socket
  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setHasUnread(true);
      });
      return () => socket.off("new_notification");
    }
  }, [socket]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await instance.patch(`/notifications/${notification._id}/read`);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
        setHasUnread(
          notifications.some((n) => !n.isRead && n._id !== notification._id)
        );
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    // You can add navigation logic here later if needed
    // e.g., navigate(notification.link);
    setNotificationOpen(false);
  };

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
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setIsDropdownOpen(false);
            }}
            className="p-3 rounded-full hover:bg-gray-100 relative transition-all duration-200"
          >
            <FaBell className="text-xl text-gray-600" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-fadeIn">
              <div className="px-4 py-2 border-b">
                <h4 className="font-medium text-gray-800">Notifications</h4>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        !n.isRead ? "bg-red-50" : ""
                      }`}
                    >
                      <p
                        className={`font-semibold text-sm ${
                          !n.isRead ? "text-deep-red" : "text-gray-800"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-sm text-gray-600">{n.message}</p>
                      <span className="block text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-center text-gray-500">
                    No new notifications.
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t text-center">
                <Link to="#" className="text-sm text-dark-red hover:underline">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
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
