import React, { useState } from "react";
import ColorVisionHeader from "./colorVisionHeader";
import ColorVisionProgressBar from "./progressBar";
import ColorVisionQuestionaire from "./questionsContainer";
import "./ColorVisionTestUI.css";

function ColorVisionTestUI() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 24;

  const handleQuestionChange = (questionNumber) => {
    setCurrentQuestion(questionNumber);
  };

  return (
    <div className="colorVisionTestUI">
      <div className="colorVisionTestUIhHeader">
        <ColorVisionHeader />
        <ColorVisionProgressBar
          current={currentQuestion}
          total={totalQuestions}
        />
      </div>

      <div className="questionsComponent">
        <ColorVisionQuestionaire
          onQuestionChange={handleQuestionChange}
          currentQuestionNumber={currentQuestion}
        />
      </div>
    </div>
  );
}

export default ColorVisionTestUI;
