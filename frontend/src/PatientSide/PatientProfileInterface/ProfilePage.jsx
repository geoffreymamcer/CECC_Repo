import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import Footer from "./Footer";
import "./PatientProfileInterface.css";

// --- Loading Configuration (in milliseconds) ---
const PROFILE_LOADING_DURATION = 500;

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
    // 👇 🤖 EMOJI: Added a subtle pattern background for a more premium feel
    <div className="h-full overflow-y-auto  bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat bg-fixed">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7F0000]"></div>
            <p className="mt-4 text-gray-600 font-medium animate-pulse">
              Loading profile...
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <ProfileHeader />
          <div className="animate-slideUp">
            <ProfileCard />
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
