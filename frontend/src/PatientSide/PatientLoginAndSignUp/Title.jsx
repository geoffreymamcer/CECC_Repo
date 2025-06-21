import React from "react";
import "./PatientLogin.css";

export default function Title({ small = false }) {
  return (
    <h1
      className={`text-dark-red font-bold text-center mb-8 ${
        small ? "text-xl" : "text-2xl"
      }`}
    >
      World Class Eye Care within Your Reach
    </h1>
  );
}
