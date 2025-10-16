import React, { useState, useEffect } from "react";
import "./PatientProfileInterface.css";
import ChangePasswordModal from "./ChangePasswordModal ";

// Helper function to calculate age from DOB
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

// Helper function to determine age category
const getAgeCategory = (age) => {
  if (!age && age !== 0) return "";
  if (age < 13) return "Child";
  if (age < 20) return "Teenager";
  if (age < 60) return "Adult";
  return "Senior";
};

const PatientInfo = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    age: "",
    ageCategory: "",
    gender: "",
    civiStatus: "",
    occupation: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...patientData });

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
          throw new Error(
            errorData.message || `Failed to fetch profile: ${res.status}`
          );
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
        const dob = data.dob
          ? new Date(data.dob).toISOString().split("T")[0]
          : "";
        const age = calculateAge(dob);
        const ageCategory = getAgeCategory(age);

        setPatientData({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          phone: data.phone_number || "",
          email: data.email || "",
          dob: dob,
          age: age,
          ageCategory: ageCategory,
          gender: data.gender || "",
          civiStatus: data.civilStatus || "",
          occupation: data.occupation || "",
          address: data.address || "",
          ...(patientId && { patientId }),
          ...(data._id && { _id: data._id }),
          ...(data.id && { id: data.id }),
        });
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Missing authentication token. Please log in again.");
        setLoading(false);
        return;
      }
      // Always require patientId for update
      const patientId =
        patientData.patientId || patientData._id || patientData.id;
      if (!patientId) {
        setError("Cannot update profile: patient ID not found.");
        setLoading(false);
        return;
      }
      const endpoint = `http://localhost:5000/api/profiles/${patientId}`;
      // Calculate age and ageCategory
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
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }
      const data = await res.json();
      setPatientData({
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        phone: data.phone_number || "",
        email: data.email || "",
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
        gender: data.gender || "",
        civiStatus: data.civilStatus || "",
        occupation: data.occupation || "",
        address: data.address || "",
        // keep id fields if present
        ...(data.patientId && { patientId: data.patientId }),
        ...(data._id && { _id: data._id }),
        ...(data.id && { id: data.id }),
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    const newData = {
      ...tempData,
      [field]: value,
    };

    // If DOB is changed, update age and ageCategory
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
              value={tempData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
            />
          ) : (
            <input
              type={type || "text"}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F0000]"
              value={tempData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          )
        ) : (
          <p className="font-medium whitespace-pre-line">
            {patientData[field]}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="profile-page-container">Loading patient data...</div>
    );
  }

  if (error) {
    return <div className="profile-page-container text-red-600">{error}</div>;
  }

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {isEditing ? "Save Changes" : "Edit Profile"}
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
