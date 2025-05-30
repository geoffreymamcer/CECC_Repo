import { useState, useEffect } from "react";
import { ishiharaTestPlatesConsistent } from "./questionsList";
import TestResult from "./testResult";

function ColorVisionQuestionaire({ onQuestionChange, currentQuestionNumber }) {
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [answers, setAnswers] = useState([]); // Store all answers
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Shuffle questions and choices on component mount
  useEffect(() => {
    const shuffled = [...ishiharaTestPlatesConsistent]
      .map((question) => ({
        ...question,
        choices: [...question.choices].sort(() => Math.random() - 0.5),
      }))
      .sort(() => Math.random() - 0.5);

    setRandomizedQuestions(shuffled);
    // Initialize answers array
    setAnswers(new Array(shuffled.length).fill({ value: null, text: "" }));
  }, []);

  const handleNext = () => {
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      value: selectedAnswer,
      text: textInputValue,
    };
    setAnswers(newAnswers);

    if (currentQuestionIndex < randomizedQuestions.length - 1) {
      const nextQuestion = currentQuestionIndex + 2;
      onQuestionChange(nextQuestion);
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Restore next answer if it exists
      const nextAnswer = newAnswers[currentQuestionIndex + 1];
      setSelectedAnswer(nextAnswer?.value || null);
      setTextInputValue(nextAnswer?.text || "");
    } else {
      // Add more detailed logging
      console.log("Test Complete!");
      console.log("Answers:", newAnswers);
      console.log("Questions:", randomizedQuestions);
      setIsTestComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before moving
      const prevQuestion = currentQuestionIndex; // Add 1 to zero-based index
      onQuestionChange(prevQuestion);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = {
        value: selectedAnswer,
        text: textInputValue,
      };
      setAnswers(newAnswers);

      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Restore previous answer
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswer(prevAnswer?.value || null);
      setTextInputValue(prevAnswer?.text || "");
    }
  };

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(value);
    // Clear text input if switching to a non-text input choice
    const selectedChoice = currentQuestion?.choices.find(
      (c) => c.value === value
    );
    if (!selectedChoice?.require_input) {
      setTextInputValue("");
    }
  };

  if (randomizedQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const isNextButtonDisabled = () => {
    const selectedChoice = currentQuestion?.choices.find(
      (c) => c.value === selectedAnswer
    );
    // Only check if answer is selected
    if (!selectedAnswer) return true;
    // Check if text input is required and empty
    if (selectedChoice?.require_input && !textInputValue.trim()) return true;
    // Remove the last line that was preventing the final question submission
    return false;
  };

  if (randomizedQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = randomizedQuestions[currentQuestionIndex];

  return (
    <>
      {!isTestComplete ? (
        <form className="questionContainer">
          <div className="choiceImageContainer">
            <img
              src={currentQuestion.imageSrc}
              alt={`Ishihara Plate ${currentQuestion.plateNumber}`}
              className="ishihara-image"
            />
          </div>

          <div className="questionAndChoicesContainer">
            <h3 className="question">{currentQuestion.question}</h3>

            <div className="choices">
              {currentQuestion.choices.map((choice, index) => (
                <div key={index} className="choice-item">
                  <input
                    type="radio"
                    id={`choice-${index}`}
                    name="ishihara-choice"
                    value={choice.value}
                    checked={selectedAnswer === choice.value}
                    onChange={() => handleAnswerSelect(choice.value)}
                    className="radio-input"
                  />
                  <label htmlFor={`choice-${index}`} className="choice-box">
                    {choice.text}
                  </label>

                  {selectedAnswer === choice.value && choice.require_input && (
                    <input
                      type="text"
                      value={textInputValue}
                      onChange={(e) => setTextInputValue(e.target.value)}
                      placeholder="Please specify..."
                      className="text-input"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="nextAndpreviousButoonContainer">
              <button
                type="button"
                className="previousButton"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>

              <button
                type="button"
                className="nextButton"
                onClick={handleNext}
                disabled={isNextButtonDisabled()}
              >
                {currentQuestionIndex === randomizedQuestions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <TestResult answers={answers} questions={randomizedQuestions} />
      )}
    </>
  );
}

export default ColorVisionQuestionaire;
