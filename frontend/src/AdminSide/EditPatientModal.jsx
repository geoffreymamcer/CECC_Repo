import React, { useState, useEffect } from "react";
// import axios from 'axios'; // You'll likely need axios for making API calls
import "../styles.css";

const EditPatientModal = ({ patient, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    medicalHistory: "",
  });

  // Effect to populate the form when the modal opens or patient prop changes
  useEffect(() => {
    if (patient) {
      setFormData({
        fullName: patient.fullName || "",
        email: patient.email || "",
        phoneNumber: patient.phoneNumber || "",
        address:
          patient.address && typeof patient.address === "object"
            ? patient.address.display || ""
            : patient.address || "",
        dateOfBirth: patient.dateOfBirth || "", // Ensure date format matches input type="date" requirements if needed
        medicalHistory: patient.medicalHistory || "",
      });
    }
  }, [patient]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- This is where you'll make an API call to your MERN backend ---
      // Example using axios:
      /*
      // Assuming your backend API endpoint for updating a patient is something like:
      // PUT /api/patients/:id
      await axios.put(`http://localhost:5000/api/patients/${patient._id}`, formData);
      */

      // Placeholder for successful update without actual API call
      console.log("Simulating patient update with data:", formData);
      console.log("Patient ID to update:", patient._id); // Assuming patient._id exists from MongoDB

      // Call the onUpdate callback prop to refresh the patient list in the parent component
      onUpdate();
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error updating patient:", error);
      // You can add more specific error handling here, e.g., display an error message to the user
      alert("Failed to update patient record. Please try again.");
    }
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Patient Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Medical History:</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
