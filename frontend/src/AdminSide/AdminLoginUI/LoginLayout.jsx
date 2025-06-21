import React from "react";
import ImageSection from "./ImageSection";
import LoginForm from "./LoginForm";
import "./AdminLogin.css";

const AdminLoginLayout = () => {
  return (
    <div className="app-container min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          <ImageSection />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginLayout;
