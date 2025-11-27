import React from "react";
import { useDashboardNav } from "./DashboardLayout";
import { FiUser, FiLock, FiBell, FiArrowRight } from "react-icons/fi";

const QuickActions = ({ unreadNotifications }) => {
  const { setActiveNav } = useDashboardNav();

  const actionButtons = [
    {
      label: "Edit Profile",
      icon: <FiUser />,
      nav: "profile",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      label: "Security",
      icon: <FiLock />,
      nav: "profile",
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#7F0000] rounded-full"></span>
        Quick Access
      </h3>

      {/* Action Tiles */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {actionButtons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => setActiveNav(btn.nav)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${btn.color}`}
          >
            <div className="text-2xl mb-2">{btn.icon}</div>
            <span className="text-xs font-bold">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Notification Widget */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <FiBell /> Recent Updates
          </h4>
          {unreadNotifications?.length > 0 && (
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadNotifications.length} New
            </span>
          )}
        </div>

        <div className="space-y-2">
          {unreadNotifications && unreadNotifications.length > 0 ? (
            unreadNotifications.slice(0, 2).map((n) => (
              <div
                key={n._id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-default"
              >
                <p className="text-xs font-bold text-gray-800 mb-0.5 truncate">
                  {n.title}
                </p>
                <p className="text-[10px] text-gray-500 line-clamp-1">
                  {n.message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-2">
              You're all caught up!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
