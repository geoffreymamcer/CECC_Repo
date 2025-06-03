import React, { useEffect, useState } from "react";
import { analyzeResults } from "./analyzeTestResult";

function TestResult({ answers, questions }) {
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const results = analyzeResults(answers, questions);
  
  // Calculate accuracy as a percentage
  const accuracy = (results.normalVisionCount / results.totalQuestions) * 100;
  
  // Generate a unique test ID for this session
  const [testId] = useState(() => {
    // Check if we already have a test ID in session storage
    const existingTestId = sessionStorage.getItem('currentTestId');
    if (existingTestId) {
      return existingTestId;
    }
    // Create a new test ID
    const newTestId = Date.now().toString();
    sessionStorage.setItem('currentTestId', newTestId);
    return newTestId;
  });
  
  useEffect(() => {
    // Save test results to database when component mounts
    // Only save if status is idle to prevent duplicate submissions
    if (saveStatus === 'idle') {
      saveTestResults();
    }
    
    // Cleanup function to remove the test ID when component unmounts
    return () => {
      sessionStorage.removeItem('currentTestId');
    };
  }, [saveStatus]);
  
  const saveTestResults = async () => {
    try {
      // Check if we've already saved this test (using localStorage)
      const savedTests = JSON.parse(localStorage.getItem('savedTests') || '[]');
      if (savedTests.includes(testId)) {
        console.log('Test already saved, skipping duplicate submission');
        setSaveStatus("success");
        return;
      }
      
      setSaveStatus("saving");
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to save test results");
      }
      
      const testData = {
        correctPlates: results.normalVisionCount,
        totalPlates: results.totalQuestions,
        accuracy: accuracy,
        testResult: results.visionStatus,
        clientTestId: testId // Include the unique test ID
      };
      
      const response = await fetch("http://localhost:5000/api/colorvisiontest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save test results");
      }
      
      // Mark this test as saved
      savedTests.push(testId);
      localStorage.setItem('savedTests', JSON.stringify(savedTests));
      
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving test results:", error);
      setErrorMessage(error.message);
      setSaveStatus("error");
    }
  };

  return (
    <div className="testResultContainer">
      <h2>Color Vision Test Results</h2>

      {/* Save Status Message */}
      {saveStatus === "saving" && (
        <div className="saveStatus saving">Saving your test results...</div>
      )}
      {saveStatus === "success" && (
        <div className="saveStatus success">Test results saved successfully!</div>
      )}
      {saveStatus === "error" && (
        <div className="saveStatus error">
          Error saving results: {errorMessage}
          <button onClick={saveTestResults} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="resultSummary">
        <h3>Assessment: {results.visionStatus}</h3>
        <p>
          Correct Answers: {results.normalVisionCount} out of{" "}
          {results.totalQuestions}
        </p>
        <p>
          Accuracy: {accuracy.toFixed(1)}%
        </p>
      </div>

      <div className="plateResults">
        <h3>Detailed Results</h3>
        {results.plateResults.map((plate, index) => (
          <div
            key={index}
            className={`plateResult ${
              plate.isCorrect ? "correct" : "incorrect"
            }`}
          >
            <span>Plate {plate.plateNumber}: </span>
            <span>Your answer: {plate.userAnswer || "No answer"}</span>
            <span className="resultIndicator">
              {plate.isCorrect ? "✓" : "×"}
            </span>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        <p>
          ⚠️ This is a screening test only. For accurate diagnosis, please
          consult an eye care professional.
        </p>
      </div>
    </div>
  );
}

export default TestResult;
