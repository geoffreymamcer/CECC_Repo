import React, { useState } from "react";
import "./PatientProfileInterface.css";
import instance from "../../api/axios";

const ProfilePicture = ({ profile, updateProfile }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const profilePic =
    profile?.profilePicture ||
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const compressedImage = await compressImage(file);
      const patientId = profile.patientId || profile._id;
      if (!patientId) throw new Error("Patient ID not found.");

      const response = await instance.put(`/profiles/${patientId}`, {
        profilePicture: compressedImage,
      });
      updateProfile({ profilePicture: response.data.profilePicture });
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError(err.response?.data?.message || "Failed to update picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {/* 👇 🤖 EMOJI: Added a white ring and shadow to make it pop off the banner */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-lg">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />

          {/* Loading Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>

      <label
        htmlFor="profile-upload"
        className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 rounded-full bg-[#7F0000] text-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#8B0000] z-10 border-2 border-white"
        title="Change Profile Picture"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && (
        <div className="absolute -bottom-8 left-0 w-full text-center text-xs text-red-600 bg-red-50 p-1 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
