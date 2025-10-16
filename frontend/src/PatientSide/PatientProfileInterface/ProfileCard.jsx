import React, { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import PatientInfo from "./PatientInfo";
import "./PatientProfileInterface.css";

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Missing authentication token. Please log in again.");
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:5000/api/profiles/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch profile: ${res.status}`);
        }
        const data = await res.json();
        // Try to get patientId from data, or from localStorage user as fallback
        let patientId = data.patientId || data._id || data.id;
        if (!patientId) {
          try {
            const userString = localStorage.getItem("user");
            if (userString) {
              const userData = JSON.parse(userString);
              patientId = userData.patientId || userData._id || userData.id;
            }
          } catch {}
        }
        setProfile({
          ...data,
          patientId,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update profile (used for profile picture change)
  const updateProfile = (newProfileData) => {
    setProfile((prev) => ({ ...prev, ...newProfileData }));
  };

  if (loading) {
    return <div className="profile-card">Loading profile...</div>;
  }
  if (error) {
    return <div className="profile-card text-red-600">{error}</div>;
  }

  return (
    <div className="profile-card bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gradient-to-b from-[#7F0000] to-[#8B0000] p-6 md:p-8 text-white">
          <ProfilePicture profile={profile} updateProfile={updateProfile} />

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2">Health Status</h3>
            <div className="flex items-center">
              <div className="h-2 flex-grow bg-red-200 rounded-full mr-2">
                <div
                  className="h-2 bg-white rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <span className="text-sm font-medium">Good</span>
            </div>
          </div>

          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">Last Visit</h3>
            <p className="text-sm">June 15, 2023</p>
            <p className="text-sm opacity-80">Dr. Michael Chen</p>
          </div>
        </div>

        <div className="md:w-2/3 p-6 md:p-8">
          <PatientInfo />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
