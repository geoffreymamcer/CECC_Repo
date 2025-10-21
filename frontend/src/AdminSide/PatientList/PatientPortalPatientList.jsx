// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import PatientListLayout from "./PatientListLayout";
import PatientInformationModal from "./PatientInformationModal";
import axios from "axios";
import AddPatientModal from "./AddPatientModal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import PatientAnalytics from "../PatientAnalytics/PatientAnalytics";
import Inventory from "../Inventory/Inventory";
import ColorVisionTest from "../ColorVisionTest2/ColorVisionTest";
import Appointments from "../Appointment/Appointments2";
import SalesAnalytics from "../SalesAnalytics/SalesAnalytics";

const PatientPortalPatientList = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // We only fetch if the active tab is 'Patient List' to be efficient
    if (activeTab === "Patient List") {
      fetchPatients();
    }
  }, [activeTab, fetchPatients]);

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle view details button click
  const handleViewDetails = (patient) => {
    // Ensure address is a renderable string (use display if address is an object)
    const safePatient = {
      ...patient,
      address:
        patient.address && typeof patient.address === "object"
          ? patient.address.display || ""
          : patient.address || "",
    };
    setSelectedPatient(safePatient);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsAddModalOpen(false);
  };

  // Handle add new patient
  // --- REPLACE the old handleAddPatient function with this new one ---
  const handleAddPatient = async (newPatientData) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Create Profile using the data passed up from the modal
      await axios.post(
        "http://localhost:5000/api/profiles",
        {
          _id: newPatientData.patientId,
          patientId: newPatientData.patientId,
          firstName: newPatientData.firstName,
          middleName: newPatientData.middleName,
          lastName: newPatientData.lastName,
          dob: newPatientData.dob,
          age: newPatientData.age,
          gender: newPatientData.gender,
          address: newPatientData.address,
          addressCombined: newPatientData.addressCombined,
          region: newPatientData.region,
          province: newPatientData.province,
          city: newPatientData.city,
          barangay: newPatientData.barangay,
          street_subdivision: newPatientData.street_subdivision,
          contact: newPatientData.contact,
          occupation: newPatientData.occupation,
          civilStatus: newPatientData.civilStatus,
          referralBy: newPatientData.referralBy,
          ageCategory: newPatientData.ageCategory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Create Medical History
      await axios.post(
        "http://localhost:5000/api/medicalhistory",
        {
          patientId: newPatientData.patientId,
          ocularHistory: newPatientData.ocularHistory,
          healthHistory: newPatientData.healthHistory,
          familyMedicalHistory: newPatientData.familyMedicalHistory,
          medications: newPatientData.medications,
          allergies: newPatientData.allergies,
          occupationalHistory: newPatientData.occupationalHistoryMH,
          digitalHistory: newPatientData.digitalHistory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Create Initial Visit Record
      await axios.post(
        "http://localhost:5000/api/visits",
        {
          patientId: newPatientData.patientId,
          visitDate: new Date(),
          chiefComplaint: newPatientData.chiefComplaint,
          associatedComplaint: newPatientData.associatedComplaint,
          diagnosis: newPatientData.diagnosis,
          treatmentPlan: newPatientData.treatmentPlan,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If all API calls are successful, close the modal
      setIsAddModalOpen(false);
      alert("Patient record created successfully!");

      // THEN, re-fetch the entire patient list to get the latest data
      // This is the key that makes the UI update in real-time!
      fetchPatients();
    } catch (err) {
      console.error("Failed to add patient record:", err);
      alert(err.response?.data?.message || "Error: Could not add patient.");
    }
  };

  // Handle delete patient
  const handleDeletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Close the details modal
        setSelectedPatient(null);
        // Re-fetch the list to reflect the deletion
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient:", err);
        alert("Error: Could not delete patient.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar time={time} date={date} setSidebarOpen={setSidebarOpen} />

        {activeTab === "Patient List" && (
          <PatientListLayout
            // Pass the state directly from the parent
            patients={patients}
            loading={loading}
            error={error}
            // Pass the handlers
            handleViewDetails={handleViewDetails}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )}
        {activeTab === "Dashboard" && <Dashboard />}
        {activeTab === "Patient Analytics" && <PatientAnalytics />}
        {activeTab === "Appointments" && <Appointments />}
        {activeTab === "Inventory" && <Inventory />}
        {activeTab === "Color Vision Test" && <ColorVisionTest />}
        {activeTab === "Financial Reports" && <SalesAnalytics />}
      </div>

      {selectedPatient && (
        <PatientInformationModal
          patient={selectedPatient}
          handleCloseModal={handleCloseModal}
          handleDeletePatient={handleDeletePatient}
        />
      )}

      {isAddModalOpen && (
        <AddPatientModal
          handleCloseModal={handleCloseModal}
          handleAddPatient={handleAddPatient}
        />
      )}
    </div>
  );
};

export default PatientPortalPatientList;
