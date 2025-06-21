import React from "react";
import "./AdminLogin.css";

const ImageSection = () => {
  return (
    <div className="image-section w-full md:w-1/2 h-64 md:h-auto flex flex-col justify-center items-center p-8 text-white bg-gradient-to-r from-primary-700 to-primary-600">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Candelaria Eye Care Clinic Admin
        </h2>
        <p className="opacity-90 max-w-md">
          Secure access to your administration dashboard
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <i className="fas fa-shield text-2xl mb-2 text-white"></i>
            <p className="text-sm text-white">Security</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <i className="fas fa-chart-line text-2xl mb-2 text-white"></i>
            <p className="text-sm text-white">Analytics</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm flex flex-col items-center">
            <i className="fas fa-cog text-2xl mb-2 text-white"></i>
            <p className="text-sm text-white">Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
