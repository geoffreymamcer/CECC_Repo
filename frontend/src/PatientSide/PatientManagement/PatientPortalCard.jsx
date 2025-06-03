import React from "react";
import { FiUser } from "react-icons/fi";
import "./PatientManagement.css";

const PatientCard = ({ patient }) => {
  return (
    <div className="patient-card-portal">
      <div className="patient-avatar-portal">
        <FiUser size={24} />
      </div>
      <div className="patient-info-portal">
        <h2>{patient.name}</h2>
        <div className="patient-meta-portal">
          <span>ID: {patient.id}</span>
          <span>DOB: {new Date(patient.dob).toLocaleDateString()}</span>
          <span>
            Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
