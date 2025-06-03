import React, { useState, useEffect } from "react";
import { FiDownload, FiCheckCircle } from "react-icons/fi";
import "./PatientManagement.css";
import ColorVisionTestHistory from "../PatientProfile/ColorVisionTestHistory";

const ColorVisionTest = ({ handleDownloadPDF }) => {
  const [testRecords, setTestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColorVisionTests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("http://localhost:5000/api/colorvisiontest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch color vision test records");
        }

        const data = await response.json();
        setTestRecords(data);
      } catch (err) {
        console.error("Error fetching color vision test records:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchColorVisionTests();
  }, []);
  if (loading) {
    return <div className="loading-message">Loading color vision test records...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (testRecords.length === 0) {
    return (
      <div className="no-records-message">
        <p>No color vision test records found.</p>
      </div>
    );
  }

  // Use the most recent test record
  const latestTest = testRecords[0];

  return (
    <div className="color-vision-record">
      <div className="section-header">
        <h3>Color Vision Test Results</h3>
        <button
          className="download-btn"
          onClick={() => handleDownloadPDF("color_vision_test")}
        >
          <FiDownload /> PDF
        </button>
      </div>

      <div className="test-details">
        <div className="detail-row">
          <span className="detail-label">Test Date:</span>
          <span>
            {new Date(latestTest.testDate).toLocaleDateString()}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Result:</span>
          <span className="result-badge">{latestTest.testResult}</span>
        </div>

        <div className="test-metrics">
          <div className="metric">
            <span className="metric-value">
              {latestTest.correctPlates}
            </span>
            <span className="metric-label">Plates Correct</span>
          </div>
          <div className="metric">
            <span className="metric-value">
              {latestTest.totalPlates}
            </span>
            <span className="metric-label">Total Plates</span>
          </div>
          <div className="metric">
            <span className="metric-value">
              {latestTest.accuracy.toFixed(1)}%
            </span>
            <span className="metric-label">Accuracy</span>
          </div>
        </div>

        {/* Show notes if available */}
        {latestTest.notes && (
          <div className="test-notes">
            <h4>Notes</h4>
            <p>{latestTest.notes}</p>
          </div>
        )}

        {/* Recommended follow-up tests section */}
        <div className="follow-up-tests">
          <h4 className="follow-up-tests-title">Recommended Follow-up Tests</h4>
          {latestTest.followUpTests && latestTest.followUpTests.length > 0 ? (
            <ul className="test-list">
              {latestTest.followUpTests.map((test, index) => (
                <li key={index} className="test-item">
                  <FiCheckCircle className="test-icon" />
                  <span>{test}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-tests-message">No follow-up tests recommended at this time. Please wait for the doctor's evaluation of your test.</p>
          )}
        </div>

        {testRecords.length > 1 && (
          <ColorVisionTestHistory />
        )}
      </div>
    </div>
  );
};

export default ColorVisionTest;
