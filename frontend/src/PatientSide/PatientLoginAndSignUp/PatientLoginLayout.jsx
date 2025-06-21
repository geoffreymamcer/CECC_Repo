import React, { useState } from "react";
import AuthCard from "./AuthCard";
import "./PatientLogin.css";

export default function PatientLoginLayout() {
  return (
    <div className="md:bg-deep-red bg-white min-h-screen flex items-center justify-center p-4">
      <AuthCard />
    </div>
  );
}
