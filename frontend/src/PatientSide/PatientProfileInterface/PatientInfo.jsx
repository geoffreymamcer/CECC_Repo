import React, { useState } from "react";
import "./PatientProfileInterface.css";
import ChangePasswordModal from "./ChangePasswordModal ";
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

const PatientInfo = ({ profileData, onProfileUpdate }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [patientData, setPatientData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...patientData });

  const handleEditClick = async () => {
    if (isEditing) {
      // Save changes to backend
      await handleSaveProfile();
    } else {
      setTempData({ ...patientData });
      setIsEditing(true);
    }
  };

  // Save profile to backend
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const patientId = patientData.patientId;
      if (!patientId)
        throw new Error("Cannot update profile: Patient ID is missing.");

      const age = calculateAge(tempData.dob);
      const ageCategory = getAgeCategory(age);

      const updatedProfile = {
        firstName: tempData.firstName,
        middleName: tempData.middleName,
        lastName: tempData.lastName,
        phone_number: tempData.phone,
        email: tempData.email,
        dob: tempData.dob,
        age: age,
        ageCategory: ageCategory,
        gender: tempData.gender,
        civilStatus: tempData.civiStatus,
        occupation: tempData.occupation,
        address: tempData.address,
      };

      const response = await instance.put(
        `/profiles/${patientId}`,
        updatedProfile
      );

      // Call the parent's update function with the new data from the server.
      onProfileUpdate(response.data);

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setSaveError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newData = { ...tempData, [field]: value };
    if (field === "dob") {
      const age = calculateAge(value);
      newData.age = age;
      newData.ageCategory = getAgeCategory(age);
    }
    setTempData(newData);
  };

  const renderInfoItem = (label, field, type, isMultiline = false) => {
    return (
      <div className="info-item py-4 border-b border-gray-100">
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        {isEditing ? (
          isMultiline ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F0000]"
              value={tempData[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
            />
          ) : (
            <input
              type={type || "text"}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F0000]"
              value={tempData[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          )
        ) : (
          <p className="font-medium whitespace-pre-line">
            {profileData[field]}
          </p>
        )}
      </div>
    );
  };

  // Logout function (same logic as reference)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/"; // redirect to homepage or login
  };

  return (
    <div className="profile-page-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Personal Information
        </h2>
        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Verified
        </span>
      </div>

      {saveError && (
        <div className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded-lg">
          {saveError}
        </div>
      )}

      <div className="space-y-3 mb-8">
        {renderInfoItem("First Name", "firstName")}
        {renderInfoItem("Middle Name", "middleName")}
        {renderInfoItem("Last Name", "lastName")}
        {renderInfoItem("Email", "email", "email")}
        {renderInfoItem("Phone Number", "phone", "tel")}
        {/* Age and Age Category are read-only since they're calculated from DOB */}
        <div className="info-item py-4 border-b border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Age</p>
          <p className="font-medium">{patientData.age}</p>
        </div>
        <div className="info-item py-4 border-b border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Age Category</p>
          <p className="font-medium">{patientData.ageCategory}</p>
        </div>
        {renderInfoItem("Date of Birth", "dob", "date")}
        {renderInfoItem("Gender", "gender")}
        {renderInfoItem("Civil Status", "civiStatus")}{" "}
        {renderInfoItem("Occupation", "occupation")}
        {renderInfoItem("Address", "address")}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={handleEditClick}
          className="edit-btn bg-gradient-to-r from-[#7F0000] to-[#8B0000] py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:from-[#8B0000] hover:to-[#6d0000]"
        >
          {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          className="delete-btn bg-white border border-red-200 text-red-600 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-50 hover:shadow-lg"
          onClick={() => setShowChangePassword(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm-1 2h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Change Password
        </button>

        <button
          className="logout-btn bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default PatientInfo;
