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
    // Profile data
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
    // Visit details
    chiefComplaint: props.chiefComplaint || "",
    associatedComplaint: props.associatedComplaint || "",
    diagnosis: props.diagnosis || "",
    treatmentPlan: props.treatmentPlan || "",
  });
  
  // Separate state for medical history data
  const [medicalHistoryData, setMedicalHistoryData] = useState({
    ocularHistory: "",
    healthHistory: "",
    familyMedicalHistory: "",
    medications: "",
    allergies: "",
    occupationalHistory: "",
    digitalHistory: "",
  });

  // Add state for visit data
  const [visitData, setVisitData] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [visitError, setVisitError] = useState(null);
  
  // State to track if medical history exists for this patient
  const [medicalHistoryId, setMedicalHistoryId] = useState(null);

  // Fetch medical history and visit data when patient ID changes
  useEffect(() => {
    const fetchData = async () => {
      if (props.patientId) {
        try {
          const token = localStorage.getItem('token');
          
          // Fetch medical history
          const medHistoryResponse = await axios.get(
            `http://localhost:5000/api/medicalhistory/${props.patientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          if (medHistoryResponse.data) {
            setMedicalHistoryData({
              ocularHistory: medHistoryResponse.data.ocularHistory || "",
              healthHistory: medHistoryResponse.data.healthHistory || "",
              familyMedicalHistory: medHistoryResponse.data.familyMedicalHistory || "",
              medications: medHistoryResponse.data.medications || "",
              allergies: medHistoryResponse.data.allergies || "",
              occupationalHistory: medHistoryResponse.data.occupationalHistory || "",
              digitalHistory: medHistoryResponse.data.digitalHistory || "",
            });
            setMedicalHistoryId(medHistoryResponse.data._id);
          }

          // Fetch visit data
          setLoadingVisits(true);
          const visitResponse = await axios.get(
            `http://localhost:5000/api/visits/patient/${props.patientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // Sort visits by date (newest first)
          const sortedVisits = visitResponse.data.sort((a, b) => 
            new Date(b.visitDate) - new Date(a.visitDate)
          );
          setVisitData(sortedVisits);
          
          // Update form data with the most recent visit information if available
          if (sortedVisits.length > 0) {
            const latestVisit = sortedVisits[0];
            setFormData(prev => ({
              ...prev,
              chiefComplaint: latestVisit.chiefComplaint || prev.chiefComplaint,
              associatedComplaint: latestVisit.associatedComplaint || prev.associatedComplaint,
              diagnosis: latestVisit.diagnosis || prev.diagnosis,
              treatmentPlan: latestVisit.treatmentPlan || prev.treatmentPlan,
            }));
          }

        } catch (error) {
          // Handle medical history 404 separately
          if (error.response && error.response.status === 404) {
            console.log("No medical history found for this patient");
            setMedicalHistoryData({
              ocularHistory: "",
              healthHistory: "",
              familyMedicalHistory: "",
              medications: "",
              allergies: "",
              occupationalHistory: "",
              digitalHistory: "",
            });
            setMedicalHistoryId(null);
          } else {
            console.error("Error fetching data:", error);
            setVisitError("Failed to fetch patient data");
          }
        } finally {
          setLoadingVisits(false);
        }
      }
    };

    fetchData();
  }, [props.patientId]);

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
    
    // Check if the field is part of medical history
    if (['ocularHistory', 'healthHistory', 'familyMedicalHistory', 'medications', 'allergies', 'occupationalHistory', 'digitalHistory'].includes(name)) {
      setMedicalHistoryData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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
      chiefComplaint: props.chiefComplaint || "",
      associatedComplaint: props.associatedComplaint || "",
      diagnosis: props.diagnosis || "",
      treatmentPlan: props.treatmentPlan || "",
    });
    
    // No need to reset medical history data as it's already in state
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      // Update the profile
      await axios.put(
        `http://localhost:5000/api/profiles/${props.patientId}`,
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
          ageCategory: formData.ageCategory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create or update medical history
      const medicalHistoryPayload = {
        patientId: props.patientId,
        ocularHistory: medicalHistoryData.ocularHistory,
        healthHistory: medicalHistoryData.healthHistory,
        familyMedicalHistory: medicalHistoryData.familyMedicalHistory,
        medications: medicalHistoryData.medications,
        allergies: medicalHistoryData.allergies,
        occupationalHistory: medicalHistoryData.occupationalHistory,
        digitalHistory: medicalHistoryData.digitalHistory,
      };

      if (medicalHistoryId) {
        await axios.put(
          `http://localhost:5000/api/medicalhistory/${medicalHistoryId}`,
          medicalHistoryPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/medicalhistory",
          medicalHistoryPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Create a new visit record
      const visitPayload = {
        patientId: props.patientId,
        visitDate: new Date(),
        chiefComplaint: formData.chiefComplaint,
        associatedComplaint: formData.associatedComplaint,
        diagnosis: formData.diagnosis,
        treatmentPlan: formData.treatmentPlan,
      };

      await axios.post(
        "http://localhost:5000/api/visits",
        visitPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Changes saved successfully!");
      if (props.onUpdate) {
        props.onUpdate();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }

    setIsEditing(false);
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
      const token = localStorage.getItem('token');
      
      // Delete the profile
      const profileResponse = await axios.delete(
        `http://localhost:5000/api/profiles/id/${props.patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If medical history exists, delete it too
      if (medicalHistoryId) {
        await axios.delete(
          `http://localhost:5000/api/medicalhistory/${medicalHistoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (profileResponse.status === 200) {
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
      chiefComplaint: props.chiefComplaint || "",
      associatedComplaint: props.associatedComplaint || "",
      diagnosis: props.diagnosis || "",
      treatmentPlan: props.treatmentPlan || "",
    });
    
    // Refetch medical history data to reset any changes
    if (props.patientId) {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/api/medicalhistory/${props.patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        if (response.data) {
          setMedicalHistoryData({
            ocularHistory: response.data.ocularHistory || "",
            healthHistory: response.data.healthHistory || "",
            familyMedicalHistory: response.data.familyMedicalHistory || "",
            medications: response.data.medications || "",
            allergies: response.data.allergies || "",
            occupationalHistory: response.data.occupationalHistory || "",
            digitalHistory: response.data.digitalHistory || "",
          });
        }
      }).catch(error => {
        console.error("Error fetching medical history:", error);
      });
    }
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
      value: medicalHistoryData.ocularHistory,
      type: "textarea",
    },
    {
      label: "Health History",
      name: "healthHistory",
      value: medicalHistoryData.healthHistory,
      type: "textarea",
    },
    {
      label: "Family Medical History",
      name: "familyMedicalHistory",
      value: medicalHistoryData.familyMedicalHistory,
      type: "textarea",
    },
    {
      label: "Medications",
      name: "medications",
      value: medicalHistoryData.medications,
      type: "textarea",
    },
    {
      label: "Allergies",
      name: "allergies",
      value: medicalHistoryData.allergies,
      type: "textarea",
    },
    {
      label: "Occupational History",
      name: "occupationalHistory",
      value: medicalHistoryData.occupationalHistory,
      type: "textarea",
    },
    {
      label: "Digital History (Screen Time)",
      name: "digitalHistory",
      value: medicalHistoryData.digitalHistory,
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

  // Add visit history section to the render


  return (
    <div className="patient-details">
      {renderSection("Personal Information", personalInfo)}
      {renderSection("Medical History", medicalHistory)}
      {renderSection("Current Visit Details", visitDetails)}

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
