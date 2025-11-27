// --- START OF FILE InputField.jsx ---

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./AdminLogin.css";

const InputField = ({ type, placeholder, icon: Icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative mb-5 group">
      {/* Label (Optional - mimicking the placeholder for visual accessibility) */}
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
        {placeholder}
      </label>

      <div className="relative">
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#b30000] transition-colors duration-300">
          <Icon size={20} />
        </div>

        {/* Input */}
        <input
          type={inputType}
          className="w-full pl-12 pr-12 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 
                     focus:bg-white focus:outline-none focus:border-[#b30000] focus:ring-4 focus:ring-red-50 
                     transition-all duration-300 placeholder-gray-400 font-medium"
          placeholder={`Enter your ${placeholder.toLowerCase()}`}
          {...props}
        />

        {/* Password Toggle (Right Icon) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
