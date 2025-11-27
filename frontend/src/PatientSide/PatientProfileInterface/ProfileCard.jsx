import React, { useState, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import PatientInfo from "./PatientInfo";
import "./PatientProfileInterface.css";
import instance from "../../api/axios";

// Helper functions (kept as is)
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
          profilePicture: data.profilePicture,
          region: data.region || "",
          province: data.province || "",
          city: data.city || "",
          barangay: data.barangay || "",
          street_subdivision: data.street_subdivision || "",
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
      civiStatus: updatedData.civilStatus || "",
    }));
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading details...</div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl">
        {error}
      </div>
    );
  if (!profile)
    return (
      <div className="p-8 text-center text-gray-500">No profile found.</div>
    );

  return (
    // 👇 🤖 EMOJI: Changed layout from Split-View to Stacked Header + Content
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
      {/* Decorative Background Banner */}
      <div className="h-32 bg-gradient-to-r from-[#7F0000] to-[#5a0000] relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="px-6 md:px-10 pb-10">
        {/* Profile Picture (Floating overlap) */}
        <div className="-mt-16 mb-6 flex justify-center md:justify-start">
          <ProfilePicture
            profile={profile}
            updateProfile={handleProfileUpdate}
          />
        </div>

        {/* Main Content */}
        <PatientInfo
          profileData={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
