import React from "react";
import "./PatientLogin.css";

export default function FormGroup({ icon, type, placeholder, onChange }) {
  return (
    <div className="input-group">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
          <i className={`fas fa-${icon}`} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          required
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-red transition-all duration-200"
        />
      </div>
    </div>
  );
}
