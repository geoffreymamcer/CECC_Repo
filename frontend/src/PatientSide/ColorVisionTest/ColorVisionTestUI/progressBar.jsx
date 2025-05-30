import React from "react";

function ColorVisionProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progressBar">
        <div
          className="progressBarFill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progressBarText">
        {current} out of {total} Questions
      </div>
    </div>
  );
}

export default ColorVisionProgressBar;
