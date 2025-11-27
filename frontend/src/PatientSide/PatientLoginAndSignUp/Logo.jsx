import React from "react";
import logo from "./LoginAndSignUpAssets/cecc.png";

export default function Logo({ size = "large" }) {
  const sizeClasses =
    size === "small"
      ? "w-24 h-24"
      : size === "medium"
      ? "w-32 h-32"
      : "w-40 h-40";

  return (
    <div className={`mx-auto flex items-center justify-center ${sizeClasses}`}>
      <img
        src={logo}
        alt="CECC Logo"
        className="object-contain w-full h-full drop-shadow-md"
      />
    </div>
  );
}
