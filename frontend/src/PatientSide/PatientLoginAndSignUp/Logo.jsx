import React from "react";
import "./PatientLogin.css";
import logo from "../LoginAndSignUp/LoginAndSignUpAssets/cecc.png";

export default function Logo({ size = "large" }) {
  // Increase the size here
  const classes = size === "small" ? "w-32 h-32" : "w-40 h-40";

  return (
    <div
      className={`bg-white rounded-full flex items-center justify-center mb-6 ${classes}`}
    >
      <img
        src={logo}
        alt="Logo"
        className="object-contain"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
