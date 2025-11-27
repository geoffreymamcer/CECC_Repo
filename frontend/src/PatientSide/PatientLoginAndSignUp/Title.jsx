import React from "react";
import "./PatientLogin.css";

export default function Title({ text, small = false }) {
  return (
    <div className="text-center mb-8">
      <h1
        className={`text-gray-800 font-bold ${small ? "text-2xl" : "text-3xl"}`}
      >
        {text || "World Class Eye Care"}
      </h1>
      {!text && (
        <p className="text-gray-500 mt-2 text-sm">
          Manage your appointments and records easily.
        </p>
      )}
    </div>
  );
}
