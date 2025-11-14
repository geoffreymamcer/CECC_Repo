import React, { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import PatientInfo from "./PatientInfo";
import "./PatientProfileInterface.css";
import instance from "../../api/axios";

const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const getAgeCategory = (age) => {
  if (!age && age !== 0) return "";
  if (age < 13) return "Child";
  if (age < 20) return "Teenager";
  if (age < 60) return "Adult";
  return "Senior";
};

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- MODIFIED --- useEffect now uses api.get
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get("/profiles/me");

        const data = response.data;
        const dob = data.dob
          ? new Date(data.dob).toISOString().split("T")[0]
          : "";
        const age = calculateAge(dob);
        const ageCategory = getAgeCategory(age);

        // Set a single, clean profile state object
        setProfile({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          phone: data.phone_number || data.contact || "",
          email: data.email || "",
          dob: dob,
          age: age,
          ageCategory: ageCategory,
          gender: data.gender || "",
          civiStatus: data.civilStatus || "",
          occupation: data.occupation || "",
          address: data.address || "",
          patientId: data.patientId || data._id,
          profilePicture: data.profilePicture, // Don't forget the profile picture
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedData) => {
    const formattedDob = updatedData.dob
      ? new Date(updatedData.dob).toISOString().split("T")[0]
      : "";
    const age = calculateAge(formattedDob);

    setProfile((prev) => ({
      ...prev,
      ...updatedData,
      dob: formattedDob,
      age: age,
      ageCategory: getAgeCategory(age),
      phone: updatedData.phone_number || updatedData.contact || "",
      civiStatus: updatedData.civilStatus || "", // Make sure this matches the child state key
    }));
  };

  if (loading) {
    return <div className="profile-card">Loading profile...</div>;
  }
  if (error) {
    return <div className="profile-card text-red-600">{error}</div>;
  }
  // Add a check in case profile failed to load
  if (!profile) {
    return (
      <div className="profile-card text-gray-500">
        Could not load profile data.
      </div>
    );
  }

  return (
    <div className="profile-card bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gradient-to-b from-[#7F0000] to-[#8B0000] p-6 md:p-8 text-white">
          <ProfilePicture
            profile={profile}
            updateProfile={handleProfileUpdate}
          />
        </div>

        <div className="md:w-2/3 p-6 md:p-8">
          <PatientInfo
            profileData={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
