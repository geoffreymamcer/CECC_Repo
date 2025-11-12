import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [inboxOpen, setInboxOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onNotificationRead(notification._id);
    }
    setNotificationOpen(false);
  };

  const handleMessageClick = (conversation) => {
    if (onMessageClick) {
      onMessageClick(conversation); // This now passes the correct object
    }
    setInboxOpen(false);
  };

  const handleSignOut = () => {
    logout();
  };

  useEffect(() => {
    if (user) {
      setUserName(user.firstName || "");
      setProfilePic(user.profilePicture || "");
    } else {
      setUserName("");
      setProfilePic("");
    }
  }, [user]);

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
          {/* --- Notification Bell --- */}
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
              {hasUnread && (
                <>
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </>
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-30 animate-fadeIn">
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
                setInboxOpen(!inboxOpen);
                setNotificationOpen(false); // Close other dropdowns
                setProfileOpen(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
            >
              {/* Mail Icon */}
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {hasUnreadMessages && (
                <>
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </>
              )}
            </button>
            {inboxOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-30 animate-fadeIn">
                <div className="px-4 py-2 border-b">
                  <h4 className="font-medium text-gray-800">Inbox</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* --- 3. UPDATE MAPPING LOGIC --- */}
                  {conversations.length > 0 ? (
                    conversations.map((convo) => (
                      <div
                        key={convo._id} // Use conversation ID for the key
                        onClick={() => handleMessageClick(convo)} // Pass the whole convo object
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          convo.lastMessage && !convo.lastMessage.isRead
                            ? "bg-red-50"
                            : ""
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm ${
                            convo.lastMessage && !convo.lastMessage.isRead
                              ? "text-deep-red"
                              : "text-gray-800"
                          }`}
                        >
                          {/* Display the subject now, which is more useful */}
                          {convo.subject}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {/* Access the last message content for the preview */}
                          {convo.lastMessage?.content}
                        </p>
                        <span className="block text-xs text-gray-400 mt-1">
                          {convo.lastMessage
                            ? new Date(
                                convo.lastMessage.createdAt
                              ).toLocaleString()
                            : ""}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-center text-gray-500">
                      You have no messages.
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t">
                  <Link
                    to="#"
                    className="text-sm text-dark-red hover:underline"
                  >
                    View all messages
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* --- Profile Dropdown --- */}
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
                <div className="h-8 w-8 rounded-full bg-dark-red flex items-center justify-center text-white font-semibold transition-transform hover:scale-105">
                  {userName ? userName[0].toUpperCase() : "?"}
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
