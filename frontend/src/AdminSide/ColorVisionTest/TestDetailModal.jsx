import React, { useState } from 'react';
import './ColorVisionTest.css';

const TestDetailModal = ({ isOpen, onClose, test, onUpdateFollowUp }) => {
  const [followUpTests, setFollowUpTests] = useState(test.followUpTests || {});

  const followUpOptions = {
    ishihara: "Ishihara Test",
    farnsworth: "Farnsworth D-15",
    anomaloscope: "Anomaloscope Test",
    lantern: "Lantern Test",
    colorimetry: "Colorimetry Analysis"
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get result status based on accuracy
  const getResultStatus = (test) => {
    if (!test || !test.accuracy) return 'unknown';
    
    const accuracy = test.accuracy;
    if (accuracy >= 90) return 'normal';
    if (accuracy >= 70) return 'mild';
    if (accuracy >= 50) return 'moderate';
    return 'severe';
  };

  const handleCheckboxChange = (test) => {
    setFollowUpTests(prev => ({
      ...prev,
      [test]: !prev[test]
    }));
  };

  const handleSave = () => {
    onUpdateFollowUp(test._id, followUpTests);
    onClose();
  };

  if (!isOpen) return null;

  const resultStatus = getResultStatus(test);

  return (
    <div className="modal-overlay">
      <div className="test-detail-modal">
        <div className="modal-header">
          <h2>Color Vision Test Details</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-content">
          <div className="patient-info">
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> {test.patientName || 'Unknown Patient'}</p>
            <p><strong>Test Date:</strong> {formatDate(test.testDate)}</p>
            <p><strong>Patient ID:</strong> {test.patientID || 'N/A'}</p>
          </div>

          <div className="test-results">
            <h3>Test Results</h3>
            <p><strong>Overall Result:</strong> 
              <span className={`result-badge ${resultStatus}`}>
                {test.testResult || 'Unknown'}
              </span>
            </p>
            <div className="detailed-results">
              <div className="result-item">
                <strong>Accuracy:</strong> {test.accuracy ? `${Math.round(test.accuracy)}%` : 'N/A'}
              </div>
              <div className="result-item">
                <strong>Correct Plates:</strong> {test.correctPlates || 0}/{test.totalPlates || 0}
              </div>
              {test.detailedResults && Object.entries(test.detailedResults).map(([key, value]) => (
                <div key={key} className="result-item">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
            </div>
          </div>

          <div className="follow-up-section">
            <h3>Recommended Follow-up Tests</h3>
            <div className="follow-up-options">
              {Object.entries(followUpOptions).map(([key, label]) => (
                <div key={key} className="follow-up-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={followUpTests[key] || false}
                      onChange={() => handleCheckboxChange(key)}
                    />
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="doctor-notes">
            <h3>Test Details</h3>
            <div className="notes-content">
              <p><strong>Vision Type:</strong> {test.testResult || 'Not specified'}</p>
              {test.accuracy && (
                <p><strong>Color Vision Accuracy:</strong> {Math.round(test.accuracy)}%</p>
              )}
              {test.notes && (
                <div className="additional-notes">
                  <strong>Additional Notes:</strong>
                  <p>{test.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save Follow-up Tests</button>
        </div>
      </div>
    </div>
  );
};

export default TestDetailModal; 