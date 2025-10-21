import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import "./PatientManagement.css";

const MedicalRecord = ({ handleDownloadPDF }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [latestVisit, setLatestVisit] = useState(null);

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view medical records");
          setLoading(false);
          return;
        }

        // Decode token to get patientId
        const tokenData = JSON.parse(atob(token.split(".")[1]));

        // Use any available ID format (id, _id, or patientId)
        const patientId = tokenData.id || tokenData._id || tokenData.patientId;

        if (!patientId) {
          setError(
            "Could not determine patient ID. Please log out and log in again."
          );
          setLoading(false);
          return;
        }

        // Fetch medical history
        const medicalHistoryResponse = await axios.get(
          `http://localhost:5000/api/medicalhistory/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch visit history
        const visitHistoryResponse = await axios.get(
          `http://localhost:5000/api/visits/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMedicalHistory(medicalHistoryResponse.data);

        const visits = visitHistoryResponse.data;
        setVisitHistory(visits);

        // Get the most recent visit
        if (visits && visits.length > 0) {
          // Sort visits by date (newest first)
          const sortedVisits = [...visits].sort(
            (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
          );
          setLatestVisit(sortedVisits[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching medical data:", error);
        setError("Failed to load medical records. Please try again later.");
        setLoading(false);
      }
    };

    fetchMedicalData();
  }, []);
  if (loading) {
    return <div className="loading">Loading medical records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="medical-record">
      <div className="section-header">
        <h3>Medical Record</h3>
        <button
          className="download-btn"
          onClick={() => handleDownloadPDF("medical_record")}
        >
          <FiDownload /> PDF
        </button>
      </div>

      {/* Medical History Section */}
      <div className="record-section">
        {medicalHistory ? (
          <div className="record-details">
            <div className="detail-section">
              <h5>Ocular History</h5>
              <p>{medicalHistory.ocularHistory || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Health History</h5>
              <p>{medicalHistory.healthHistory || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Family Medical History</h5>
              <p>
                {medicalHistory.familyMedicalHistory || "No data available"}
              </p>
            </div>

            <div className="detail-section">
              <h5>Medications</h5>
              <p>{medicalHistory.medications || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Allergies</h5>
              <p>{medicalHistory.allergies || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Occupational History</h5>
              <p>{medicalHistory.occupationalHistory || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Digital History (Screen Time)</h5>
              <p>{medicalHistory.digitalHistory || "No data available"}</p>
            </div>
          </div>
        ) : (
          <p>No medical history records available.</p>
        )}
      </div>

      <div className="section-divider"></div>

      {/* Latest Visit Section */}
      <div className="record-section">
        <h4>Latest Visit</h4>
        {latestVisit ? (
          <div className="record-details">
            <div className="detail-row">
              <span className="detail-label">Visit Date:</span>
              <span>
                {new Date(latestVisit.visitDate).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Provider:</span>
              <span>{latestVisit.doctor}</span>
            </div>

            <div className="detail-section">
              <h5>Chief Complaint</h5>
              <p>{latestVisit.chiefComplaint || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Associated Complaint</h5>
              <p>{latestVisit.associatedComplaint || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Diagnosis</h5>
              <p>{latestVisit.diagnosis || "No data available"}</p>
            </div>

            <div className="detail-section">
              <h5>Treatment Plan</h5>
              <p>{latestVisit.treatmentPlan || "No data available"}</p>
            </div>
          </div>
        ) : (
          <p>No visit records available.</p>
        )}
      </div>

      {/* Visit History Section - Show if there are multiple visits */}
      {visitHistory.length > 1 && (
        <>
          <div className="section-divider"></div>
          <div className="record-section">
            <h4>Visit History</h4>
            <div className="visit-history-list">
              {visitHistory.slice(1).map((visit, index) => (
                <div key={visit._id || index} className="visit-history-item">
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span>
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Diagnosis:</span>
                    <span>{visit.diagnosis || "No diagnosis recorded"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalRecord;
