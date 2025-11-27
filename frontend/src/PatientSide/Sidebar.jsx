import React, { useState } from "react";
import { useDashboardNav } from "./PatientDashboard2/DashboardLayout";
import ContactSupportModal from "./ContactSupportModal";
import {
  FiHome,
  FiCalendar,
  FiShoppingBag,
  FiUser,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
// Assuming you have a white version of your logo or just use text
// import logoWhite from "../assets/logo-white.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { activeNav, setActiveNav } = useDashboardNav();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", key: "home", icon: <FiHome /> },
    { name: "Appointments", key: "appointments", icon: <FiCalendar /> },
    { name: "Products", key: "products", icon: <FiShoppingBag /> },
    { name: "My Profile", key: "profile", icon: <FiUser /> },
  ];

  const handleNavClick = (key) => {
    setActiveNav(key);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#7F0000] to-[#5a0000] text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col h-screen
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Brand Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
              {/* Placeholder logo icon */}
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide leading-tight">
                CECC Portal
              </h1>
              <p className="text-xs text-white/60 font-medium">
                Patient Access
              </p>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 px-2">
            Menu
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden
                ${
                  activeNav === item.key
                    ? "bg-white text-[#7F0000] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span
                className={`text-xl transition-colors ${
                  activeNav === item.key
                    ? "text-[#7F0000]"
                    : "text-white/60 group-hover:text-white"
                }`}
              >
                {item.icon}
              </span>
              <span className="relative z-10">{item.name}</span>

              {/* Active Indicator for Non-Active Items on Hover */}
              {activeNav !== item.key && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / Support */}
        <div className="p-4 m-4 mt-auto bg-black/20 rounded-2xl backdrop-blur-sm border border-white/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FiHelpCircle className="text-white/80" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Need Help?</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Contact our support team for assistance.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 bg-white text-[#7F0000] text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Contact Support
          </button>
        </div>
      </div>

      <ContactSupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
