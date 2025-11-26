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
    <div className="input-group">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
          {IconComponent ? (
            <IconComponent size={20} />
          ) : (
            <i className={`fas fa-${icon?.toLowerCase()}`} />
          )}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          value={value} // This was missing, it's needed for a controlled input.
          {...props} // This ensures other props like `required` are passed down.
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-red transition-all duration-200 ${
            disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
          }`}
        />
      </div>
    </div>
  );
}
