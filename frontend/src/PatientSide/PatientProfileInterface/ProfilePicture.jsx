import React, { useState } from "react";
import "./PatientProfileInterface.css";
import instance from "../../api/axios";

const ProfilePicture = ({ profile, updateProfile }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Use profile.profilePicture if available, else fallback
  const profilePic =
    profile?.profilePicture ||
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

  // Image compression (from reference)
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
      if (!patientId) {
        throw new Error("Patient ID not found. Cannot upload picture.");
      }

      // Use the central api instance. The auth header is handled automatically.
      const response = await instance.put(`/profiles/${patientId}`, {
        profilePicture: compressedImage,
      });

      // Update parent profile state with the new picture URL from the server's response
      updateProfile({ profilePicture: response.data.profilePicture });
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      setError(
        err.response?.data?.message || "Failed to update profile picture"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-5">
        <div className="profile-pic w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <label
          htmlFor="profile-upload"
          className="camera-icon absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white text-[#7F0000] flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-105"
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
        {uploading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 text-[#7F0000] text-sm font-bold">
            Uploading...
          </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold">
          {profile?.firstName || ""} {profile?.middleName || ""}{" "}
          {profile?.lastName || ""}
        </h2>
        <p className="text-white/80 text-sm md:text-base">
          Patient ID: {profile?.patientId || profile?._id || profile?.id || "-"}
        </p>
        {error && <div className="text-red-200 mt-2 text-xs">{error}</div>}
      </div>
    </div>
  );
};

export default ProfilePicture;
