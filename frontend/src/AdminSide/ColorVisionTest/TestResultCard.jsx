import React from 'react';
import './ColorVisionTest.css';

const TestResultCard = ({ test, onViewMore }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Map test result to a status category
  const getResultStatus = (test) => {
    if (!test || !test.accuracy) return 'unknown';
    
    const accuracy = test.accuracy;
    if (accuracy >= 90) return 'normal';
    if (accuracy >= 70) return 'mild';
    if (accuracy >= 50) return 'moderate';
    return 'severe';
  };

  // Get display text for the result
  const getResultText = (test) => {
    if (!test || !test.testResult) return 'Unknown';
    return test.testResult;
  };

  const resultStatus = getResultStatus(test);

  return (
    <div className="test-result-card">
      <div className="test-result-header">
        <h3>{test.patientName || 'Unknown Patient'}</h3>
        <span className="test-date">{formatDate(test.testDate)}</span>
      </div>
      
      <div className="test-result-content">
        <div className="result-summary">
          <p className="result-label">Overall Result:</p>
          <p className={`result-value ${resultStatus}`}>
            {getResultText(test)}
          </p>
        </div>
        
        <div className="test-type">
          <p className="type-label">Accuracy:</p>
          <p className="type-value">{test.accuracy ? `${Math.round(test.accuracy)}%` : 'N/A'}</p>
        </div>

        <div className="test-details">
          <p className="details-label">Plates:</p>
          <p className="details-value">
            {test.correctPlates || 0}/{test.totalPlates || 0} correct
          </p>
        </div>
      </div>

      <div className="test-result-footer">
        <button className="view-more-btn" onClick={() => onViewMore(test)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default TestResultCard; 