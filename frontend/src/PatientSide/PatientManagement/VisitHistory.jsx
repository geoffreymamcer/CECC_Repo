import React, { useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import "./PatientManagement.css";

const VisitHistory = ({ selectedVisit, setSelectedVisit }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication required");
        }

        // Get the patient ID from the token payload
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // Check for multiple possible ID formats
        const patientId = tokenPayload.patientId || tokenPayload.id || tokenPayload._id;
        
        console.log('Token payload:', tokenPayload);
        console.log('Extracted patient ID:', patientId);
        
        if (!patientId) {
          throw new Error("Patient ID not found in token");
        }

        const response = await fetch(`http://localhost:5000/api/visits/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch visit history");
        }

        const data = await response.json();
        
        // Sort visits from newest to oldest
        const sortedVisits = data.sort((a, b) => {
          return new Date(b.visitDate) - new Date(a.visitDate);
        });

        setVisits(sortedVisits);
      } catch (err) {
        console.error("Error fetching visit history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, []);
  if (loading) {
    return (
      <div className="visit-history">
        <h3>Visit History</h3>
        <div className="loading-message">Loading visit history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="visit-history">
        <h3>Visit History</h3>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="visit-history">
        <h3>Visit History</h3>
        <div className="no-visits-message">No visit history found.</div>
      </div>
    );
  }

  return (
    <div className="visit-history">
      <h3>Visit History</h3>
      <div className="visit-list">
        {visits.map((visit, index) => (
          <div
            key={visit._id}
            className={`visit-item ${
              selectedVisit === index ? "selected" : ""
            }`}
            onClick={() => setSelectedVisit(index)}
          >
            <div className="visit-date">
              {new Date(visit.visitDate).toLocaleDateString()}
            </div>
            <div className="visit-summary">
              <div className="visit-doctor">Dr. Philip Richard Budiongan</div>
              <div className="visit-reason">{visit.chiefComplaint}</div>
            </div>
            <FiChevronRight className="visit-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitHistory;
