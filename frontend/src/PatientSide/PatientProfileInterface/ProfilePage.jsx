import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import Footer from "./Footer";
import "./PatientProfileInterface.css";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader />
        <ProfileCard />
        <Footer />
      </div>{" "}
    </div>
  );
};

export default ProfilePage;
