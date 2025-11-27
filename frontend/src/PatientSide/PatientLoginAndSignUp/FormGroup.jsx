import React from "react";
import "./PatientLogin.css";
import { User, Lock, Mail, Key, Phone } from "lucide-react";

export default function FormGroup({
  icon,
  type,
  placeholder,
  onChange,
  disabled,
  value,
  ...props
}) {
  const iconComponents = {
    User: User,
    user: User,
    Lock: Lock,
    lock: Lock,
    envelope: Mail,
    mail: Mail,
    key: Key,
    phone: Phone,
    telephone: Phone,
  };

  const IconComponent = iconComponents[icon];

  return (
    <div className="mb-4 group">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
        {placeholder}
      </label>
      <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#7F0000] transition-colors">
          {IconComponent ? (
            <IconComponent size={20} />
          ) : (
            <i className={`fas fa-${icon?.toLowerCase()}`} />
          )}
        </div>
        <input
          type={type}
          disabled={disabled}
          onChange={onChange}
          value={value}
          {...props}
          className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] focus:bg-white transition-all ${
            disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
          }`}
        />
      </div>
    </div>
  );
}
