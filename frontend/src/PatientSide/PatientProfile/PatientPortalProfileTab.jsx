import React, { useState, useEffect } from "react";
import "./ProfileTab.css";
import ColorVisionTestHistory from "./ColorVisionTestHistory";

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Log user data from localStorage for debugging
        const userString = localStorage.getItem("user");
        if (userString) {
          try {
            const userData = JSON.parse(userString);
            console.log('User data in profile tab:', userData);
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        } else {
          console.log('No user data found in localStorage');
        }
        
        const token = localStorage.getItem("token");
        if (!token) {
          console.error('No token found in localStorage');
          setError('Missing authentication token. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching profile with token:', token.substring(0, 10) + '...');
        
        const res = await fetch("http://localhost:5000/api/profiles/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Profile fetch response not OK:', res.status, errorData);
          throw new Error(errorData.message || `Failed to fetch profile: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Profile data received:', data);
        
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          address: data.address || "",
          gender: data.gender || "",
          occupation: data.occupation || "",
          civilStatus: data.civilStatus || "",
        });
        setTempProfilePic(data.profilePicture || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to fetch profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          // Calculate new dimensions while maintaining aspect ratio
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

          // Get compressed image as base64 string
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 0.7 is the quality (0-1)
          resolve(compressedBase64);
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please select an image file");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size should be less than 5MB");
          return;
        }

        // Compress the image
        const compressedImage = await compressImage(file);
        setTempProfilePic(compressedImage);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Error processing image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedProfile = {
        ...formData,
        profilePicture: tempProfilePic,
      };

      const res = await fetch(
        `http://localhost:5000/api/profiles/id/${profile._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      setProfile(data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id) {
          throw new Error("User information not found");
        }

        const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to delete account");
        }

        // Clear all auth data and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        window.location.href = "/";
      } catch (err) {
        setError(err.message);
        console.error("Error deleting account:", err);
      }
    }
  };

  const handleLogout = () => {
    // Clear all authentication-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear(); // Clear any session data if exists

    // Redirect to the login page
    window.location.href = "/";
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }
  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Profile Information</h2>
      </div>

      <div className="profile-content">
        <div className="profile-picture-section">
          <div className="profile-picture-container">
            <img
              src={
                editMode
                  ? tempProfilePic ||
                    profile.profilePicture ||
                    "/default-profile.png"
                  : profile.profilePicture || "/default-profile.png"
              }
              alt="Profile"
              className="profile-picture"
            />
            {editMode && (
              <div className="profile-picture-edit">
                <label htmlFor="profile-pic-upload" className="edit-icon-label">
                  <span className="edit-icon">+</span>
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}
          </div>
          <h3 className="patient-name">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="patient-id">Patient ID: {profile.patientId}</p>
        </div>

        {editMode ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="civilStatus">Civil Status</label>
              <select
                id="civilStatus"
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
              >
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Save Changes
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">First Name:</span>
              <span className="info-value">{profile.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Middle Name:</span>
              <span className="info-value">{profile.middleName || "-"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Name:</span>
              <span className="info-value">{profile.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number:</span>
              <span className="info-value">{profile.phone_number}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth:</span>
              <span className="info-value">
                {profile.dob ? new Date(profile.dob).toLocaleDateString() : "-"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">{profile.address || "-"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender:</span>
              <span className="info-value">{profile.gender || "-"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Occupation:</span>
              <span className="info-value">{profile.occupation || "-"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Civil Status:</span>
              <span className="info-value">{profile.civilStatus || "-"}</span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Color Vision Test History Section */}
      {!editMode && !loading && !error && (
        <ColorVisionTestHistory />
      )}

      <div className="profile-actions">
        {!editMode && (
          <button className="btn-edit" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
        <button className="btn-delete" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfileTab;
