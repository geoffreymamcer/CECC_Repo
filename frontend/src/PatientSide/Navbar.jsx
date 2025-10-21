// src/components/Navbar.jsx (Corrected and Secure)

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Import the useAuth hook to access the secure context
import { useAuth } from "../context/AuthContext"; // <-- Adjust path if needed

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  // 2. Get the user object and logout function from the context
  // This 'user' object is trustworthy and loaded by the context.
  const { user, logout } = useAuth();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // 3. Refactor the sign-out handler to use the centralized logout function
  const handleSignOut = () => {
    logout(); // This handles token removal, state update, and redirection.
  };

  // 4. Update the useEffect to react to changes in the 'user' object from the context
  useEffect(() => {
    // When the 'user' object is loaded by the context, update the local state.
    if (user) {
      setUserName(user.firstName || "");
      // Assuming the user object from /api/users/me includes the profile picture
      setProfilePic(user.profilePicture || "");
    } else {
      // If there is no user, clear the name and picture
      setUserName("");
      setProfilePic("");
    }
  }, [user]); // The effect now correctly depends on the 'user' object

  const notifications = [
    { text: "New test results available", time: "2 hours ago" },
    { text: "Appointment reminder: June 25", time: "1 day ago" },
    { text: "New message from Dr. Johnson", time: "3 days ago" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Candelaria Eye Care Clinic
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">{/* ... notification JSX ... */}</div>
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-gray-600">
                Welcome, {/* This will now work correctly */}
                <span className="font-medium">{userName || "there"}</span>
              </span>
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 transition-transform hover:scale-105"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-dark-red flex items-center justify-center text-white transition-transform hover:scale-105">
                  {userName ? userName[0] : "?"}
                </div>
              )}
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 animate-fadeIn">
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Your Profile
                </Link>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
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
