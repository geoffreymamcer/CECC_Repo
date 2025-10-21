// src/App.js
import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import PatientListLayout from "./PatientListLayout";
import PatientInformationModal from "./PatientInformationModal";
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
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Smith",
      dob: "1985-03-15",
      phone: "(555) 123-4567",
      email: "john.smith@example.com",
      address: "123 Main St, Anytown, CA 90210",
      lastVisit: "2023-05-10",
      nextAppointment: "2023-08-15",
      status: "Active",
      history:
        "Allergies: Penicillin, Seasonal allergies. Previous surgeries: Appendectomy (2010). Chronic conditions: None.",
      medications: "Loratadine 10mg daily during allergy season",
      bloodType: "O+",
      height: "5'11\"",
      weight: "178 lbs",
    },
    {
      id: 2,
      name: "Emily Johnson",
      dob: "1990-07-22",
      phone: "(555) 567-8901",
      email: "emily.j@example.com",
      address: "456 Oak Ave, Somewhere, NY 10001",
      lastVisit: "2023-06-15",
      nextAppointment: "2023-09-10",
      status: "Active",
      history:
        "Asthma since childhood. Hospitalized for pneumonia in 2018. Family history of heart disease.",
      medications: "Albuterol inhaler as needed, Fluticasone 100mcg daily",
      bloodType: "A-",
      height: "5'5\"",
      weight: "132 lbs",
    },
    {
      id: 3,
      name: "Michael Brown",
      dob: "1978-11-05",
      phone: "(555) 234-5678",
      email: "michael.b@example.com",
      address: "789 Pine Rd, Nowhere, TX 75001",
      lastVisit: "2023-04-20",
      nextAppointment: null,
      status: "Inactive",
      history:
        "Diagnosed with Type 2 Diabetes in 2015. Hypertension. Mild obesity.",
      medications: "Metformin 1000mg daily, Lisinopril 10mg daily",
      bloodType: "B+",
      height: "6'2\"",
      weight: "210 lbs",
    },
    {
      id: 4,
      name: "Sarah Davis",
      dob: "1995-01-30",
      phone: "(555) 890-1234",
      email: "sarah.d@example.com",
      address: "321 Elm Blvd, Anycity, FL 33101",
      lastVisit: "2023-07-01",
      nextAppointment: "2023-08-22",
      status: "Active",
      history:
        "Generally healthy. Occasional migraines. No significant medical history.",
      medications: "Ibuprofen as needed for headaches",
      bloodType: "AB+",
      height: "5'7\"",
      weight: "145 lbs",
    },
    {
      id: 5,
      name: "Robert Wilson",
      dob: "1982-09-18",
      phone: "(555) 456-7890",
      email: "robert.w@example.com",
      address: "654 Cedar Ln, Yourtown, IL 60007",
      lastVisit: "2023-03-12",
      nextAppointment: null,
      status: "Inactive",
      history: "Hypertension managed with medication. High cholesterol.",
      medications: "Atorvastatin 20mg daily, Hydrochlorothiazide 25mg daily",
      bloodType: "O-",
      height: "5'10\"",
      weight: "195 lbs",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      dob: "1992-12-25",
      phone: "(555) 123-7890",
      email: "jennifer.l@example.com",
      address: "987 Birch St, Mytown, WA 98101",
      lastVisit: "2023-07-05",
      nextAppointment: "2023-10-12",
      status: "Active",
      history: "History of migraines. Seasonal allergies. Mild anemia.",
      medications: "Sumatriptan as needed, Ferrous sulfate 325mg daily",
      bloodType: "A+",
      height: "5'4\"",
      weight: "128 lbs",
    },
  ]);

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
  const handleAddPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
    setIsAddModalOpen(false);
  };

  // Handle delete patient
  const handleDeletePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((patient) => patient.id !== id));
      setSelectedPatient(null);
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
            patients={patients.map((p) => ({
              ...p,
              address:
                p.address && typeof p.address === "object"
                  ? p.address.display || ""
                  : p.address || "",
            }))}
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
