import React, { useState, useEffect } from "react";
import Input from "./InputField";
import "./AdminSide.css";
import axios from "axios";
import Dropdown from "./dropdown-component";

function FloatingButton({ onPatientAdded }) {
  const [isOpen, setIsOpen] = useState(false);

  // Personal Information (Profile Collection)
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [occupation, setOccupation] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [referralBy, setReferralBy] = useState("");
  const [ageCategory, setAgeCategory] = useState("");

  // Medical History (Medical History Collection)
  const [ocularHistory, setOcularHistory] = useState("");
  const [healthHistory, setHealthHistory] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [occupationalHistoryMH, setOccupationalHistoryMH] = useState("");
  const [digitalHistory, setDigitalHistory] = useState("");

  // Visit-Specific Details (Visit Collection)
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [associatedComplaint, setAssociatedComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");

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
    setDob(selectedDob);

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

      setAge(calculatedAge.toString());
      setAgeCategory(getAgeCategory(calculatedAge));
    } else {
      setAge("");
      setAgeCategory("");
    }
  };

  // Function to generate the next patient ID
  const generateNextPatientId = async () => {
    try {
      // Get the latest patient ID from the backend
      const response = await axios.get("http://localhost:5000/api/profiles/latest-id");
      const latestId = response.data.latestId || "CECC25B-0000";

      // Extract the numeric part
      const numericPart = parseInt(latestId.split("-")[1]);
      
      // Generate the next ID
      const nextNumber = numericPart + 1;
      const paddedNumber = nextNumber.toString().padStart(4, "0");
      const newPatientId = `CECC25B-${paddedNumber}`;
      
      setPatientId(newPatientId);
      return newPatientId;
    } catch (error) {
      console.error("Error generating patient ID:", error);
      // Fallback to a timestamp-based ID if the request fails
      const timestamp = new Date().getTime();
      const fallbackId = `CECC25B-${timestamp}`;
      setPatientId(fallbackId);
      return fallbackId;
    }
  };

  // Generate patient ID when the form opens
  useEffect(() => {
    if (isOpen) {
      generateNextPatientId();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Ensure we have a patient ID
      const currentPatientId = patientId || await generateNextPatientId();

      // 1. Create Profile
      const profileResponse = await axios.post(
        "http://localhost:5000/api/profiles",
        {
          _id: currentPatientId, // Include the custom ID
          patientId: currentPatientId, // Also store it in the patientId field
          firstName,
          middleName,
          lastName,
          dob,
          age: parseInt(age),
          gender,
          address,
          contact,
          occupation,
          civilStatus,
          referralBy,
          ageCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Create Medical History
      await axios.post(
        "http://localhost:5000/api/medicalhistory",
        {
          patientId: currentPatientId,
          ocularHistory,
          healthHistory,
          familyMedicalHistory,
          medications,
          allergies,
          occupationalHistory: occupationalHistoryMH,
          digitalHistory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 3. Create Visit Record
      await axios.post(
        "http://localhost:5000/api/visits",
        {
          patientId: currentPatientId,
          visitDate: new Date(),
          chiefComplaint,
          associatedComplaint,
          diagnosis,
          treatmentPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear all form fields
      setPatientId("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setDob("");
      setAge("");
      setGender("");
      setAddress("");
      setContact("");
      setOccupation("");
      setCivilStatus("");
      setReferralBy("");
      setAgeCategory("");
      setOcularHistory("");
      setHealthHistory("");
      setFamilyMedicalHistory("");
      setMedications("");
      setAllergies("");
      setOccupationalHistoryMH("");
      setDigitalHistory("");
      setChiefComplaint("");
      setAssociatedComplaint("");
      setDiagnosis("");
      setTreatmentPlan("");

      // Close popup and notify parent
      setIsOpen(false);
      if (onPatientAdded) {
        onPatientAdded(profileResponse.data);
      }

      alert("Patient record created successfully!");
    } catch (error) {
      console.error("Error creating patient record:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create patient record. Please try again."
      );
    }
  };

  return (
    <>
      <button className="floating-button" onClick={() => setIsOpen(true)}>
        +
      </button>

      {isOpen && (
        <div className="popup-overlay open">
          <div className="popup-content">
            <h2>Add New Patient</h2>
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  readOnly
                  className="patient-id-field"
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="text" value={age} readOnly />
              </div>
              <div className="form-group">
                <label>Age Category</label>
                <input type="text" value={ageCategory} readOnly />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Civil Status</label>
                <select
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  required
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Legally Separated">Legally Separated</option>
                </select>
              </div>
              <div className="form-group">
                <label>Referral By</label>
                <input
                  type="text"
                  value={referralBy}
                  onChange={(e) => setReferralBy(e.target.value)}
                />
              </div>

              {/* Medical History Section */}
              <h3>Medical History</h3>
              <div className="form-group">
                <label>Ocular History</label>
                <textarea
                  value={ocularHistory}
                  onChange={(e) => setOcularHistory(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Health History</label>
                <textarea
                  value={healthHistory}
                  onChange={(e) => setHealthHistory(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Family Medical History</label>
                <textarea
                  value={familyMedicalHistory}
                  onChange={(e) => setFamilyMedicalHistory(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Medications</label>
                <textarea
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Allergies</label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Occupational History</label>
                <textarea
                  value={occupationalHistoryMH}
                  onChange={(e) => setOccupationalHistoryMH(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Digital History (Screen Time)</label>
                <input
                  type="text"
                  value={digitalHistory}
                  onChange={(e) => setDigitalHistory(e.target.value)}
                />
              </div>

              {/* Visit Details Section */}
              <h3>Visit Details</h3>
              <div className="form-group">
                <label>Chief Complaint</label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Associated Complaint</label>
                <textarea
                  value={associatedComplaint}
                  onChange={(e) => setAssociatedComplaint(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Diagnosis</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Treatment Plan</label>
                <textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  required
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingButton;
