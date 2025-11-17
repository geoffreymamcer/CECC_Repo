import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import Footer from "./Footer";
import "./PatientProfileInterface.css";

// --- Loading Configuration (in milliseconds) ---
// Adjust this value to control the loading state duration across all environments
const PROFILE_LOADING_DURATION = 500; // 1.5 seconds

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading state on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, PROFILE_LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-dark-red"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ProfileHeader />
          <ProfileCard />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
