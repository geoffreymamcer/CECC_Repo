import React, { useEffect, useState } from "react";
import { analyzeResults } from "./analyzeTestResult";
import instance from "../../../api/axios";

function TestResult({ answers, questions }) {
  const [saveStatus, setSaveStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const results = analyzeResults(answers, questions);

  const accuracy = (results.normalVisionCount / results.totalQuestions) * 100;

  const [testId] = useState(() => {
    const existingTestId = sessionStorage.getItem("currentTestId");
    if (existingTestId) {
      return existingTestId;
    }
    // Create a new test ID
    const newTestId = Date.now().toString();
    sessionStorage.setItem("currentTestId", newTestId);
    return newTestId;
  });

  useEffect(() => {
    // Save test results to database when component mounts
    // Only save if status is idle to prevent duplicate submissions
    if (saveStatus === "idle") {
      saveTestResults();
    }

    // Cleanup function to remove the test ID when component unmounts
    return () => {
      sessionStorage.removeItem("currentTestId");
    };
  }, [saveStatus]);

  const saveTestResults = async () => {
    try {
      // Check if we've already saved this test (using localStorage)
      const savedTests = JSON.parse(localStorage.getItem("savedTests") || "[]");
      if (savedTests.includes(testId)) {
        console.log("Test already saved, skipping duplicate submission");
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
        clientTestId: testId, // Include the unique test ID
      };

      const response = await instance.post("/colorvisiontest", testData);

      savedTests.push(testId);
      localStorage.setItem("savedTests", JSON.stringify(savedTests));

      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving test results:", error);
      // axios provides better error details in error.response
      setErrorMessage(error.response?.data?.message || error.message);
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
        <div className="saveStatus success">
          Test results saved successfully!
        </div>
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
        <p>Accuracy: {accuracy.toFixed(1)}%</p>
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
