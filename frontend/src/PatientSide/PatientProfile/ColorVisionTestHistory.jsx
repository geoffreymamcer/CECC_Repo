import React, { useState, useEffect } from "react";
import "./ColorVisionTestHistory.css";

function ColorVisionTestHistory() {
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestHistory = async () => {
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
          throw new Error("Failed to fetch test history");
        }

        const data = await response.json();
        setTestHistory(data);
      } catch (err) {
        console.error("Error fetching test history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestHistory();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading-spinner">Loading test history...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (testHistory.length === 0) {
    return (
      <div className="no-tests-message">
        <p>You haven't taken any color vision tests yet.</p>
        <a href="/patient/colorvisiontest" className="take-test-button">
          Take a Color Vision Test
        </a>
      </div>
    );
  }

  return (
    <div className="color-vision-history">
      <h3>Color Vision Test History</h3>
      
      <div className="test-history-list">
        {testHistory.map((test) => (
          <div key={test._id} className="test-history-item">
            <div className="test-date">
              <span className="date-label">Test Date:</span>
              <span className="date-value">{formatDate(test.testDate)}</span>
            </div>
            
            <div className="test-details">
              <div className="test-score">
                <span className="score-label">Score:</span>
                <span className="score-value">
                  {test.correctPlates} / {test.totalPlates} ({test.accuracy.toFixed(1)}%)
                </span>
              </div>
              
              <div className="test-result">
                <span className="result-label">Result:</span>
                <span className={`result-value ${test.testResult.toLowerCase().includes('normal') ? 'normal' : 'deficiency'}`}>
                  {test.testResult}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorVisionTestHistory;
