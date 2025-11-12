import React from "react";
// --- 1. Import the custom hook we created in DashboardLayout ---
import { useDashboardNav } from "./DashboardLayout";

const QuickActions = ({ unreadNotifications }) => {
  // --- 2. Use the hook to get the navigation setter function ---
  const { setActiveNav } = useDashboardNav();

  const actions = [
    {
      name: "Edit Profile",
      icon: "M9 5l7 7-7 7",
      // --- 3. Add an onClick handler to navigate ---
      onClick: () => setActiveNav("profile"),
    },
    {
      name: "Change Password",
      icon: "M9 5l7 7-7 7",
      // Change Password button also navigates to the profile page
      onClick: () => setActiveNav("profile"),
    },
  ];

  const notifications = [
    { text: "New test results available", time: "2 hours ago", type: "info" },
    {
      text: "Appointment reminder: June 25",
      time: "1 day ago",
      type: "normal",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            // --- 4. Attach the onClick handler here ---
            onClick={action.onClick}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
          >
            <span>{action.name}</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={action.icon}
              ></path>
            </svg>
          </button>
        ))}
      </div>

      <h4 className="font-medium text-gray-800 mt-6 mb-3">New Notifications</h4>
      <div className="space-y-3">
        {unreadNotifications && unreadNotifications.length > 0 ? (
          // If there are unread notifications, map over them
          unreadNotifications.slice(0, 2).map(
            (
              notification // Show max of 2 for brevity
            ) => (
              <div
                key={notification._id}
                className="p-3 border rounded bg-blue-50 border-blue-100"
              >
                <p className="text-sm font-semibold text-blue-800">
                  {notification.title}
                </p>
                <p className="text-xs text-blue-700">{notification.message}</p>
              </div>
            )
          )
        ) : (
          // If the array is empty, show a message
          <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
            No new notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
