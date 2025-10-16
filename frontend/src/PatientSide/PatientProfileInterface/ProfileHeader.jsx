import React from "react";
import "./PatientProfileInterface.css";

const ProfileHeader = () => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Patient Profile
      </h1>
      <p className="text-gray-600 text-lg">
        Manage your health profile and information
      </p>
    </div>
  );
};

export default ProfileHeader;
