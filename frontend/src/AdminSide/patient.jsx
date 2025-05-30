import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./patientCard";
import "./AdminSide.css";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profiles");
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientAdded = (newPatient) => {
    setPatients((prevPatients) => [newPatient, ...prevPatients]);
  };

  if (loading) {
    return <div className="patientList">Loading patients...</div>;
  }

  if (error) {
    return (
      <div className="patientList" style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="patientList">
      {patients.length > 0 ? (
        patients.map((patient) => {
          const fullName = `${patient.firstName} ${
            patient.middleName ? patient.middleName + " " : ""
          }${patient.lastName}`.trim();
          return (
            <Card
              key={patient._id}
              patientId={patient._id}
              patientName={fullName}
              patient={patient}
            />
          );
        })
      ) : (
        <p>No patient records found.</p>
      )}
    </div>
  );
}

export default PatientList;
