// --- START OF FILE LoginLayout.jsx ---

import React from "react";
import ImageSection from "./ImageSection";
import LoginForm from "./LoginForm";
import "./AdminLogin.css";

const AdminLoginLayout = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-6 bg-gray-50 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-red-100 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100 transition-all duration-500 hover:shadow-red-900/5">
        <ImageSection />
        <LoginForm />
      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-4 text-center w-full text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Candelaria Eye Care Clinic. All rights
        reserved.
      </div>
    </div>
  );
};

export default AdminLoginLayout;
