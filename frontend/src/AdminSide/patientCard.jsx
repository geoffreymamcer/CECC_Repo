// patientCard.jsx
import React, { useState } from "react";
import "./AdminSide.css";
import profilePicture from "./AdminSideAssets/profile-pic-place-holder.jpg";
import PatientInformation from "./patient-info";
import axios from "axios";

function Card(props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const togglePopup = async () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setPatientDetails(null);
      setErrorDetails(null);
      return;
    }

    if (props.patientId) {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profiles/id/${props.patientId}`
        );
        setPatientDetails({
          ...response.data,
          patientId: props.patientId,
          fullName: props.patientName,
        });
        setIsPopupOpen(true);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setErrorDetails("Failed to load patient details.");
        setIsPopupOpen(false);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  return (
    <div className="patientRecordCard">
      <img
        src={props.patient?.profilePicture || profilePicture}
        alt="Patient Profile"
        className="patientProfilePicture"
      />
      <p className="patientName">{props.patientName}</p>
      <button className="viewDetailsButton" onClick={togglePopup}>
        View More
      </button>

      {isPopupOpen && (
        <div className="patient-info-popup">
          <div className="patient-information-container">
            {loadingDetails && <p>Loading patient details...</p>}
            {errorDetails && (
              <p style={{ color: "red" }}>Error: {errorDetails}</p>
            )}
            {patientDetails && !loadingDetails && (
              <PatientInformation
                {...patientDetails}
                onClick={togglePopup}
                onUpdate={() => {
                  togglePopup();
                  if (props.onUpdate) {
                    props.onUpdate();
                  }
                }}
              />
            )}
            {!patientDetails &&
              !loadingDetails &&
              !errorDetails &&
              props.patientId && <p>No patient details found for this ID.</p>}
            {!props.patientId && (
              <p style={{ color: "red" }}>Patient ID is missing.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
