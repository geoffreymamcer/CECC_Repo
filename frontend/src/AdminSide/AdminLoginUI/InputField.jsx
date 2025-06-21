import React from "react";
import "./AdminLogin.css";

const InputField = ({ type, placeholder, icon, ...props }) => {
  return (
    <div className="input-container relative mb-4">
      <i
        className={`input-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 ${icon}`}
      ></i>
      <input
        type={type}
        placeholder={placeholder}
        className="input-field w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-200 shadow-input transition-all duration-300"
        {...props}
      />
    </div>
  );
};

export default InputField;
