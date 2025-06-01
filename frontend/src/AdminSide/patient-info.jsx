// patient-info.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminSide.css";

const PatientInformation = (props) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: props.fullName || "",
    dob: formatDate(props.dob) || "",
    age: props.age || "",
    address: props.address || "",
    contact: props.contact || "",
    occupation: props.occupation || "",
    civilStatus: props.civilStatus || "",
    referralBy: props.referralBy || "",
    gender: props.gender || "",
    ageCategory: props.ageCategory || "",
    ocularHistory: props.ocularHistory || "",
    healthHistory: props.healthHistory || "",
    familyMedicalHistory: props.familyMedicalHistory || "",
    medications: props.medications || "",
    allergies: props.allergies || "",
    occupationalHistory: props.occupationalHistory || "",
    digitalHistory: props.digitalHistory || "",
    chiefComplaint: props.chiefComplaint || "",
    associatedComplaint: props.associatedComplaint || "",
    diagnosis: props.diagnosis || "",
    treatmentPlan: props.treatmentPlan || "",
  });

  // Update formData when props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dob: formatDate(props.dob) || prev.dob,
    }));
  }, [props.dob]);

  const getAgeCategory = (calculatedAge) => {
    if (calculatedAge >= 0 && calculatedAge <= 12) return "Child: 0-12";
    if (calculatedAge >= 13 && calculatedAge <= 19) return "Teen: 13-19";
    if (calculatedAge >= 20 && calculatedAge <= 39) return "Adult: 20-39";
    if (calculatedAge >= 40 && calculatedAge <= 59) return "Middle Age: 40-59";
    if (calculatedAge >= 60) return "Senior: 60 & up";
    return "";
  };

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setFormData((prev) => ({
      ...prev,
      dob: selectedDob,
    }));

    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();

      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setFormData((prev) => ({
        ...prev,
        age: calculatedAge.toString(),
        ageCategory: getAgeCategory(calculatedAge),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        age: "",
        ageCategory: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      fullName: props.fullName || "",
      dob: formatDate(props.dob) || "",
      age: props.age || "",
      address: props.address || "",
      contact: props.contact || "",
      occupation: props.occupation || "",
      civilStatus: props.civilStatus || "",
      referralBy: props.referralBy || "",
      gender: props.gender || "",
      ageCategory: props.ageCategory || "",
      ocularHistory: props.ocularHistory || "",
      healthHistory: props.healthHistory || "",
      familyMedicalHistory: props.familyMedicalHistory || "",
      medications: props.medications || "",
      allergies: props.allergies || "",
      occupationalHistory: props.occupationalHistory || "",
      digitalHistory: props.digitalHistory || "",
      chiefComplaint: props.chiefComplaint || "",
      associatedComplaint: props.associatedComplaint || "",
      diagnosis: props.diagnosis || "",
      treatmentPlan: props.treatmentPlan || "",
    });
  };

  const handleSave = async () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profiles/id/${props.patientId}`,
        {
          firstName: formData.fullName.split(" ")[0],
          middleName: formData.fullName.split(" ").slice(1, -1).join(" ") || "",
          lastName: formData.fullName.split(" ").slice(-1)[0],
          dob: formData.dob,
          age: parseInt(formData.age),
          gender: formData.gender,
          address: formData.address,
          contact: formData.contact,
          occupation: formData.occupation,
          civilStatus: formData.civilStatus,
          referralBy: formData.referralBy,
          ageCategory: formData.ageCategory,
          ocularHistory: formData.ocularHistory,
          healthHistory: formData.healthHistory,
          familyMedicalHistory: formData.familyMedicalHistory,
          medications: formData.medications,
          allergies: formData.allergies,
          occupationalHistory: formData.occupationalHistory,
          digitalHistory: formData.digitalHistory,
          chiefComplaint: formData.chiefComplaint,
          associatedComplaint: formData.associatedComplaint,
          diagnosis: formData.diagnosis,
          treatmentPlan: formData.treatmentPlan,
        }
      );

      if (response.status === 200) {
        alert("Patient record updated successfully!");
        setIsEditing(false);
        // Notify parent component to refresh the data
        if (props.onUpdate) {
          props.onUpdate();
        }
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update patient record. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    // First confirmation
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this patient record? This action cannot be undone."
    );

    if (!isConfirmed) {
      return;
    }

    // Second confirmation for extra safety
    const finalConfirmation = window.confirm(
      "Please confirm once more that you want to permanently delete this patient record."
    );

    if (!finalConfirmation) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/profiles/id/${props.patientId}`
      );

      if (response.status === 200) {
        alert("Patient record deleted successfully!");
        // Close the patient info popup
        if (props.onClick) {
          props.onClick();
        }
        // Notify parent component to refresh the list
        if (props.onUpdate) {
          props.onUpdate();
        }
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete patient record. Please try again."
      );
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      const isConfirmed = window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      );

      if (!isConfirmed) {
        return;
      }
    }

    setIsEditing(false);
    setFormData({
      fullName: props.fullName || "",
      dob: formatDate(props.dob) || "",
      age: props.age || "",
      address: props.address || "",
      contact: props.contact || "",
      occupation: props.occupation || "",
      civilStatus: props.civilStatus || "",
      referralBy: props.referralBy || "",
      gender: props.gender || "",
      ageCategory: props.ageCategory || "",
      ocularHistory: props.ocularHistory || "",
      healthHistory: props.healthHistory || "",
      familyMedicalHistory: props.familyMedicalHistory || "",
      medications: props.medications || "",
      allergies: props.allergies || "",
      occupationalHistory: props.occupationalHistory || "",
      digitalHistory: props.digitalHistory || "",
      chiefComplaint: props.chiefComplaint || "",
      associatedComplaint: props.associatedComplaint || "",
      diagnosis: props.diagnosis || "",
      treatmentPlan: props.treatmentPlan || "",
    });
  };

  const personalInfo = [
    {
      label: "Full Name",
      name: "fullName",
      value: formData.fullName,
      type: "text",
      component: "input",
    },
    {
      label: "Date of Birth",
      name: "dob",
      value: formData.dob,
      type: "date",
      component: "input",
      onChange: handleDobChange,
    },
    {
      label: "Age",
      name: "age",
      value: formData.age,
      type: "number",
      component: "input",
      readOnly: true,
    },
    {
      label: "Age Category",
      name: "ageCategory",
      value: formData.ageCategory,
      type: "text",
      component: "input",
      readOnly: true,
    },
    {
      label: "Gender",
      name: "gender",
      value: formData.gender,
      component: "dropdown",
      options: [
        "Male",
        "Female",
        "Transgender Male",
        "Transgender Female",
        "Non-Binary",
        "Intersex",
        "Other",
        "Prefer Not to Say",
      ],
    },
    {
      label: "Address",
      name: "address",
      value: formData.address,
      type: "text",
      component: "input",
    },
    {
      label: "Contact",
      name: "contact",
      value: formData.contact,
      type: "text",
      component: "input",
    },
    {
      label: "Occupation",
      name: "occupation",
      value: formData.occupation,
      type: "text",
      component: "input",
    },
    {
      label: "Civil Status",
      name: "civilStatus",
      value: formData.civilStatus,
      type: "text",
      component: "dropdown",
      options: [
        "Single",
        "Married",
        "Widowed",
        "Legally Separated",
      ]
    },
    {
      label: "Referral By",
      name: "referralBy",
      value: formData.referralBy,
      type: "text",
      component: "input",
    },
  ];

  const medicalHistory = [
    {
      label: "Ocular History",
      name: "ocularHistory",
      value: formData.ocularHistory,
      type: "textarea", // Use textarea for longer inputs
    },
    {
      label: "Health History",
      name: "healthHistory",
      value: formData.healthHistory,
      type: "textarea",
    },
    {
      label: "Family Medical History",
      name: "familyMedicalHistory",
      value: formData.familyMedicalHistory,
      type: "textarea",
    },
    {
      label: "Medications",
      name: "medications",
      value: formData.medications,
      type: "textarea",
    },
    {
      label: "Allergies",
      name: "allergies",
      value: formData.allergies,
      type: "textarea",
    },
    {
      label: "Occupational History",
      name: "occupationalHistory",
      value: formData.occupationalHistory,
      type: "textarea",
    },
    {
      label: "Digital History (Screen Time)",
      name: "digitalHistory",
      value: formData.digitalHistory,
      type: "text",
    },
  ];

  const visitDetails = [
    {
      label: "Chief Complaint",
      name: "chiefComplaint",
      value: formData.chiefComplaint,
      type: "textarea",
    },
    {
      label: "Associated Complaint",
      name: "associatedComplaint",
      value: formData.associatedComplaint,
      type: "textarea",
    },
    {
      label: "Diagnosis",
      name: "diagnosis",
      value: formData.diagnosis,
      type: "textarea",
    },
    {
      label: "Treatment Plan and Management",
      name: "treatmentPlan",
      value: formData.treatmentPlan,
      type: "textarea",
    },
  ];

  const renderSection = (title, data) => (
    <>
      <h2 className="informationCategory">{title}</h2>
      {data.map(
        (
          { label, name, value, type, component, options, onChange, readOnly },
          index
        ) => (
          <div className="detail-row" key={index}>
            <span className="detail-label">{label}:</span>
            {component === "dropdown" ? (
              <select
                name={name}
                value={value || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="patient-dropdown"
              >
                <option value="">Select...</option>
                {options.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : type === "textarea" ? (
              <textarea
                className="inputField"
                name={name}
                value={value}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
              />
            ) : (
              <input
                className="inputField"
                type={type}
                name={name}
                value={value}
                onChange={onChange || handleChange}
                disabled={!isEditing || readOnly}
                size={value ? value.toString().length : 20}
              />
            )}
          </div>
        )
      )}
    </>
  );

  return (
    <div className="patient-details">
      {renderSection("Personal Information", personalInfo)}
      {renderSection("Medical History", medicalHistory)}
      {renderSection("Visit-Specific Details", visitDetails)}

      <div className="patient-info-actions">
        {!isEditing ? (
          <>
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
            <button
              className="patient-information-close-button"
              onClick={props.onClick}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientInformation;
