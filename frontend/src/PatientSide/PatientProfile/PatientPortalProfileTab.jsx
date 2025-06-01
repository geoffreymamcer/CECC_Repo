import React, { useState, useEffect } from 'react';
import './ProfileTab.css';

function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [tempProfilePic, setTempProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/profiles/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          middleName: data.middleName || '',
          lastName: data.lastName || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          date_of_birth: data.date_of_birth || '',
          address: data.address || '',
        });
        setTempProfilePic(data.profilePicture || null);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    setEditMode(false);
    // In a real app, you would update the parent state or make an API call here
  };

  const handleDeleteAccount = () => {
    // Add delete account logic here
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested");
      // API call to delete account would go here
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("User logged out");
    // Clear session/token and redirect would go here
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
              src={profile.profilePicture || '/default-profile.png'} 
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
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>
          <h3 className="patient-name">{profile.firstName} {profile.lastName}</h3>
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
              <label htmlFor="date_of_birth">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formData.date_of_birth}
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

            <div className="form-actions">
              <button type="submit" className="btn-save">Save Changes</button>
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
              <span className="info-value">{profile.middleName || '-'}</span>
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
              <span className="info-value">{profile.date_of_birth}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">{profile.address}</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-actions">
        {!editMode && (
          <button 
            className="btn-edit"
            onClick={() => setEditMode(true)}
          >
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
};

export default ProfileTab;