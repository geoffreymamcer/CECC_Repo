import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBell,
  FiMail,
  FiMenu,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  notifications,
  hasUnread,
  onNotificationRead,
  conversations = [],
  hasUnreadMessages = false,
  onMessageClick,
}) => {
  const { user, logout } = useAuth();

  // State for dropdowns
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Refs for click-outside detection
  const navRef = useRef(null);

  useEffect(() => {
    if (user) {
      setUserName(user.firstName || "Patient");
      setProfilePic(user.profilePicture || "");
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      ref={navRef}
      className="bg-white border-b border-gray-100 sticky top-0 z-40 h-20 flex items-center shadow-sm w-full"
    >
      <div className="w-full px-4 md:px-8 flex justify-between items-center">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* --- Messages --- */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("messages")}
              className={`p-2.5 rounded-full transition-all duration-200 relative group ${
                activeDropdown === "messages"
                  ? "bg-red-50 text-[#7F0000]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <FiMail size={20} />
              {hasUnreadMessages && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Messages Dropdown */}
            {activeDropdown === "messages" && (
              <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn origin-top-right">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h4 className="font-bold text-gray-800 text-sm">Messages</h4>
                  <Link
                    to="#"
                    className="text-xs font-bold text-[#7F0000] hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {conversations.length > 0 ? (
                    conversations.map((convo) => (
                      <button
                        key={convo._id}
                        onClick={() => {
                          onMessageClick(convo);
                          setActiveDropdown(null);
                        }}
                        className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${
                          convo.lastMessage && !convo.lastMessage.isRead
                            ? "bg-red-50/30"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                            convo.lastMessage && !convo.lastMessage.isRead
                              ? "bg-[#7F0000]"
                              : "bg-transparent"
                          }`}
                        ></div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm truncate ${
                              convo.lastMessage && !convo.lastMessage.isRead
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {convo.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {convo.lastMessage?.content}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {convo.lastMessage
                              ? new Date(
                                  convo.lastMessage.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No messages yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- Notifications --- */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("notifications")}
              className={`p-2.5 rounded-full transition-all duration-200 relative group ${
                activeDropdown === "notifications"
                  ? "bg-red-50 text-[#7F0000]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <FiBell size={20} />
              {hasUnread && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {activeDropdown === "notifications" && (
              <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn origin-top-right">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h4 className="font-bold text-gray-800 text-sm">
                    Notifications
                  </h4>
                  <button className="text-xs font-bold text-gray-400 hover:text-gray-600">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          if (!n.isRead) onNotificationRead(n._id);
                          setActiveDropdown(null);
                        }}
                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${
                          !n.isRead ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                            !n.isRead ? "bg-blue-500" : "bg-gray-200"
                          }`}
                        ></div>
                        <div>
                          <p
                            className={`text-sm ${
                              !n.isRead
                                ? "font-bold text-gray-800"
                                : "font-medium text-gray-600"
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

          {/* --- Profile Menu --- */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("profile")}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                  Patient
                </p>
              </div>

              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7F0000] to-[#5a0000] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {userName ? userName[0].toUpperCase() : "P"}
                </div>
              )}
              <FiChevronDown
                className={`text-gray-400 transition-transform duration-200 ${
                  activeDropdown === "profile" ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {activeDropdown === "profile" && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn origin-top-right p-2">
                <div className="px-3 py-2 mb-2 border-b border-gray-50 md:hidden">
                  <p className="font-bold text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>

                <Link
                  to="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="text-gray-400" /> Your Profile
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FiSettings className="text-gray-400" /> Settings
                </Link>

                <div className="my-2 border-t border-gray-100"></div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
