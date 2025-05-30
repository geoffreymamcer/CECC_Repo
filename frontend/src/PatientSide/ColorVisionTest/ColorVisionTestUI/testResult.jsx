import React from "react";
import { analyzeResults } from "./analyzeTestResult";

function TestResult({ answers, questions }) {
  const results = analyzeResults(answers, questions);

  return (
    <div className="testResultContainer">
      <h2>Color Vision Test Results</h2>

      <div className="resultSummary">
        <h3>Assessment: {results.visionStatus}</h3>
        <p>
          Correct Answers: {results.normalVisionCount} out of{" "}
          {results.totalQuestions}
        </p>
        <p>
          Accuracy:{" "}
          {((results.normalVisionCount / results.totalQuestions) * 100).toFixed(
            1
          )}
          %
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
