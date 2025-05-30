import React, { useState } from "react";
import Input from "./InputField";
import "./AdminSide.css";
import axios from "axios";
import Dropdown from "./dropdown-component";

function FloatingButton({ onPatientAdded }) {
  const [isOpen, setIsOpen] = useState(false);

  // Personal Information
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [occupation, setOccupation] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [referralBy, setReferralBy] = useState("");
  const [ageCategory, setAgeCategory] = useState("");

  // Medical History
  const [ocularHistory, setOcularHistory] = useState("");
  const [healthHistory, setHealthHistory] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [occupationalHistoryMH, setOccupationalHistoryMH] = useState("");
  const [digitalHistory, setDigitalHistory] = useState("");

  // Visit-Specific Details
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract first, middle, and last names from fullName
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const middleName =
        nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

      const response = await axios.post("http://localhost:5000/api/profiles", {
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
        ocularHistory,
        healthHistory,
        familyMedicalHistory,
        medications,
        allergies,
        occupationalHistory: occupationalHistoryMH,
        digitalHistory,
        chiefComplaint,
        associatedComplaint,
        diagnosis,
        treatmentPlan,
      });

      if (response.status === 201) {
        alert("Patient record added successfully!");
        if (onPatientAdded) {
          onPatientAdded(response.data);
        }
        // Reset form
        setFullName("");
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
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding patient record:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add patient record. Please try again."
      );
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Input
        type="button"
        className="floating-button"
        value="+"
        onClick={togglePopup}
      />

      <div
        className={`popup-overlay ${isOpen ? "open" : ""}`}
        onClick={togglePopup}
      >
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h2>Patient Record</h2>
          <form onSubmit={handleSubmit}>
            <h3>Personal Information</h3>
            <label htmlFor="patient-name">
              Full Name (including middle name)
            </label>
            <input
              id="patient-name"
              name="patient_name"
              type="text"
              required
              placeholder="e.g. Juan Dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label htmlFor="patient-birthday">Date of Birth</label>
            <input
              id="patient-birthday"
              type="date"
              required
              placeholder="MM/DD/YYYY"
              value={dob}
              onChange={handleDobChange}
            />

            <label htmlFor="patient-age">Age</label>
            <input
              id="patient-age"
              type="number"
              required
              placeholder="Age"
              value={age}
              readOnly // Make age field read-only since it's calculated
            />

            <label htmlFor="gender">Gender</label>
            <Dropdown
              name="gender"
              id="sex"
              defaultValue="Sex"
              options={[
                "Male",
                "Female",
                "Transgender Male",
                "Transgender Female",
                "Non-Binary",
                "Intersex",
                "Other",
                "Prefer Not to Say",
              ]}
              className="patient-sex-dropdown"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <label htmlFor="ageCategory">Age Category</label>

            <input
              type="text"
              id="ageCategory"
              value={ageCategory}
              readOnly // Make age category field read-only since it's calculated
              placeholder="Age Category"
            />

            <label htmlFor="patient-address">Patient Address</label>
            <input
              id="patient-address"
              name="patient-address"
              type="text"
              required
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="contact">Contact Details (Phone, Tel, Email)</label>
            <input
              type="text"
              required
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              required
              placeholder="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />

            <label htmlFor="civilStatus">Civil Status</label>
            <input
              type="text"
              placeholder="Civil Status"
              value={civilStatus}
              onChange={(e) => setCivilStatus(e.target.value)}
            />

            <label htmlFor="referralBy">Referral By</label>
            <input
              type="text"
              placeholder="Referral By"
              value={referralBy}
              onChange={(e) => setReferralBy(e.target.value)}
            />

            <h3>Medical History</h3>
            <label htmlFor="ocularHistory">Ocular History</label>
            <input
              type="text"
              placeholder="Ocular History"
              value={ocularHistory}
              onChange={(e) => setOcularHistory(e.target.value)}
            />

            <label htmlFor="healthHistory">Health History</label>
            <input
              type="text"
              placeholder="Health History"
              value={healthHistory}
              onChange={(e) => setHealthHistory(e.target.value)}
            />

            <label htmlFor="familyMedicalHistory">Family Medical History</label>
            <input
              type="text"
              placeholder="Family Medical History"
              value={familyMedicalHistory}
              onChange={(e) => setFamilyMedicalHistory(e.target.value)}
            />

            <label htmlFor="medications">Medications</label>
            <input
              type="text"
              placeholder="Medications"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
            />

            <label htmlFor="allergies">Allergies</label>
            <input
              type="text"
              placeholder="Allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />

            <label htmlFor="occupationalHistoryMH">
              Occupational History (Medical)
            </label>
            <input
              type="text"
              placeholder="Occupational History"
              value={occupationalHistoryMH}
              onChange={(e) => setOccupationalHistoryMH(e.target.value)}
            />

            <label htmlFor="digitalHistory">
              Digital History (Screen Time)
            </label>
            <input
              type="text"
              placeholder="Screen Time (hours/day)"
              value={digitalHistory}
              onChange={(e) => setDigitalHistory(e.target.value)}
            />

            <h3>Visit-Specific Details</h3>
            <label htmlFor="chiefComplaint">Chief Complaint</label>
            <input
              type="text"
              required
              placeholder="Chief Complaint"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
            />

            <label htmlFor="associatedComplaint">Associated Complaint</label>
            <input
              type="text"
              placeholder="Associated Complaint"
              value={associatedComplaint}
              onChange={(e) => setAssociatedComplaint(e.target.value)}
            />

            <label htmlFor="diagnosis">Diagnosis</label>
            <input
              type="text"
              required
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />

            <label htmlFor="treatmentPlan">Treatment Plan and Management</label>
            <input
              type="text"
              required
              placeholder="Treatment Plan and Management"
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
            />

            <div className="button-group">
              <button type="submit">Submit</button>
              <button type="button" onClick={togglePopup}>
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FloatingButton;
