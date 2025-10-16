import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(""); // NEW
  const navigate = useNavigate();
  

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove JWT or session token
    localStorage.removeItem("user");
    localStorage.clear(); //g


    navigate("/"); // 
  };


  useEffect(() => {
    const userString = localStorage.getItem("user");
    let patientId = null;
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        if (userData.firstName) setUserName(userData.firstName);
        patientId = userData.patientId || userData._id || userData.id;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    // Fetch profile from backend
    const token = localStorage.getItem("token");
    if (token && patientId) {
      axios
        .get(`http://localhost:5000/api/profiles/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const profile = response.data;
          if (profile.profilePicture) setProfilePic(profile.profilePicture);
          if (profile.firstName) setUserName(profile.firstName); // <-- fetch name from backend
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);
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
          <div className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setProfileOpen(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-30 animate-fadeIn">
                <div className="px-4 py-2 border-b">
                  <h4 className="font-medium">Notifications</h4>
                </div>
                {notifications.map((notification, index) => (
                  <Link
                    key={index}
                    to="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {notification.text}
                    <span className="block text-xs text-gray-500">
                      {notification.time}
                    </span>
                  </Link>
                ))}
                <div className="px-4 py-2 border-t">
                  <Link
                    to="#"
                    className="text-sm text-dark-red hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-gray-600">
                Welcome,{" "}
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
                <Link
                  to="/"
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
