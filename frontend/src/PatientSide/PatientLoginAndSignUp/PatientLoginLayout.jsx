import React from "react";
import AuthCard from "./AuthCard";
import "./PatientLogin.css";

export default function PatientLoginLayout() {
  return (
    <div className="min-h-screen w-full bg-[#7F0000] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat flex items-center justify-center p-4 md:p-6">
      <AuthCard />
    </div>
  );
}
