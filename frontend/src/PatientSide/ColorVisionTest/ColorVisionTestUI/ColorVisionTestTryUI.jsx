// src/components/ColorVisionTestTryUI.jsx
import { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiHome, FiEye } from "react-icons/fi";
import { ishiharaTestPlatesConsistent } from "./questionsList"; // Ensure this is the correct path
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- HELPER FUNCTIONS ---

// Function to shuffle the plates array
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// This function is now adapted from analyzeTestResult.js
function determineVisionStatus(results) {
  const normalVisionPercentage =
    (results.normalVisionCount / results.totalQuestions) * 100;

  if (normalVisionPercentage >= 90) {
    return "Normal Color Vision";
  } else if (normalVisionPercentage >= 70) {
    if (results.protanopiaCount > results.deuteranopiaCount) {
      return "Mild Protanopia (Red-Blind)";
    } else if (results.deuteranopiaCount > results.protanopiaCount) {
      return "Mild Deuteranopia (Green-Blind)";
    }
    return "Mild Color Vision Deficiency";
  } else {
    // Note: The AI evaluation does not explicitly check for total color blindness.
    // This condition is included from your file but may not be triggered
    // unless the AI prompt is modified to classify "Total Color Blindness".
    if (results.totalColorBlindnessCount >= results.totalQuestions * 0.8) {
      return "Total Color Blindness";
    } else if (results.protanopiaCount > results.deuteranopiaCount) {
      return "Severe Protanopia (Red-Blind)";
    } else if (results.deuteranopiaCount > results.protanopiaCount) {
      return "Severe Deuteranopia (Green-Blind)";
    }
    return "Severe Color Vision Deficiency";
  }
}

// --- MAIN COMPONENT ---

const IshiharaTest = () => {
  // --- STATE MANAGEMENT ---
  const [plates, setPlates] = useState([]);
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [currentUserInput, setCurrentUserInput] = useState("");
  const [testAnswers, setTestAnswers] = useState([]); // Stores raw answers locally
  const [testResults, setTestResults] = useState([]); // Stores final, evaluated results
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // State for API and submission process
  const [isLoading, setIsLoading] = useState(false); // Used for the final evaluation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visionStatus, setVisionStatus] = useState("");

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // Verify API key is available
  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("Warning: REACT_APP_GEMINI_API_KEY is not set");
    }
  }, []);

  // --- COMPONENT LIFECYCLE & INITIALIZATION ---
  useEffect(() => {
    const shuffled = shuffleArray(ishiharaTestPlatesConsistent);
    setPlates(shuffled);
  }, []);

  // New function to evaluate all answers in a single API call
  const evaluateAllAnswersWithGemini = async (answers) => {
    setIsLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Create a detailed prompt with all user answers
    const answersPrompt = answers
      .map(
        (answer) => `
      {
        "plateNumber": ${answer.plate.plateNumber},
        "question": "${answer.plate.question}",
        "userAnswer": "${answer.userAnswer}",
        "normalVisionAnswer": "${answer.plate.normalVisionAnswer}",
        "protanopiaAnswer": "${answer.plate.protanopiaAnswer}",
        "deuteranopiaAnswer": "${answer.plate.deuteranopiaAnswer}"
      }
    `
      )
      .join(",\n");

    const prompt = `
      You are an expert assistant for a color vision test. You will receive a JSON array of a user's answers for a series of Ishihara plates.

      Analyze each answer in the array. Users might type numbers as words (e.g., "twelve" for "12"), describe the image ("I see nothing"), or describe following a line. These should be considered valid interpretations.

      For each object in the array, determine which vision category the user's answer most closely matches.
      - If it matches or is a semantic equivalent of the "Normal Vision" answer, classify it as "Normal".
      - If it matches or is a semantic equivalent of the "Protanopia" answer, classify it as "Protanopia".
      - If it matches or is a semantic equivalent of the "Deuteranopia" answer, classify it as "Deuteranopia".
      - Otherwise, classify it as "Incorrect".

      Your task is to return a valid JSON array where each object corresponds to an answer from the input and contains three keys:
      1. "plateNumber": The integer plate number you evaluated.
      2. "evaluation": A string which can be one of four values: "Normal", "Protanopia", "Deuteranopia", or "Incorrect".
      3. "reasoning": A brief, one-sentence explanation for your classification.

      Here is the user's test data:
      [${answersPrompt}]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const jsonText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const evaluatedResults = JSON.parse(jsonText);

      // Merge original answers with AI evaluation
      const finalResults = answers.map((answer) => {
        const aiResult = evaluatedResults.find(
          (r) => r.plateNumber === answer.plate.plateNumber
        ) || { evaluation: "Incorrect", reasoning: "AI evaluation failed." };

        return {
          plateNumber: answer.plate.plateNumber,
          userAnswer: answer.userAnswer,
          evaluation: aiResult.evaluation,
          isCorrect: aiResult.evaluation === "Normal",
          reasoning: aiResult.reasoning,
          normalVisionAnswer: answer.plate.normalVisionAnswer,
        };
      });

      setTestResults(finalResults);

      // Calculate counts from the AI-evaluated results
      const resultCounts = {
        normalVisionCount: finalResults.filter((r) => r.evaluation === "Normal")
          .length,
        protanopiaCount: finalResults.filter(
          (r) => r.evaluation === "Protanopia"
        ).length,
        deuteranopiaCount: finalResults.filter(
          (r) => r.evaluation === "Deuteranopia"
        ).length,
        totalColorBlindnessCount: 0, // The current AI prompt does not classify this
        totalQuestions: plates.length,
      };

      // Use the new function to determine the final status
      const finalVisionStatus = determineVisionStatus(resultCounts);
      setVisionStatus(finalVisionStatus);
    } catch (error) {
      console.error("Error evaluating with Gemini:", error);
      setSubmitError(
        "There was an error analyzing your results with the AI. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleNext = () => {
    if (!currentUserInput.trim()) {
      alert("Please enter what you see in the image.");
      return;
    }

    const currentPlate = plates[currentPlateIndex];
    const newAnswer = {
      plate: currentPlate,
      userAnswer: currentUserInput,
    };

    // Store the answer locally without calling the API
    const updatedAnswers = [...testAnswers, newAnswer];
    setTestAnswers(updatedAnswers);
    setCurrentUserInput("");

    if (currentPlateIndex < plates.length - 1) {
      setCurrentPlateIndex(currentPlateIndex + 1);
    } else {
      setIsCompleted(true); // Mark the test as complete
    }
  };

  const handlePrev = () => {
    if (currentPlateIndex > 0) {
      setCurrentPlateIndex(currentPlateIndex - 1);
      // Optional: allow user to edit previous answer
      const previousAnswer = testAnswers.pop();
      if (previousAnswer) {
        setCurrentUserInput(previousAnswer.userAnswer);
        setTestAnswers([...testAnswers]);
      }
    }
  };

  // --- DATA SUBMISSION TO BACKEND ---
  useEffect(() => {
    // Step 1: When the test is completed, call the AI for evaluation.
    if (isCompleted && testAnswers.length === plates.length) {
      evaluateAllAnswersWithGemini(testAnswers);
    }
  }, [isCompleted, testAnswers, plates.length]);

  useEffect(() => {
    // Step 2: Once AI results are processed and visionStatus is set, submit to the backend.
    if (visionStatus && !submitSuccess && !isSubmitting) {
      const submitTestResults = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        const correctPlates = testResults.filter((r) => r.isCorrect).length;
        const totalPlates = plates.length;
        const accuracy = Math.round((correctPlates / totalPlates) * 100);

        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Authentication required");

          const payload = {
            answers: testResults.map((r) => r.userAnswer),
            correctPlates,
            totalPlates,
            accuracy,
            testResult: visionStatus,
            plateResults: testResults,
            testDate: new Date().toISOString(),
          };

          const response = await fetch(
            "http://localhost:5000/api/colorvisiontest",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to save test result");
          }

          setSubmitSuccess(true);
        } catch (err) {
          setSubmitError(err.message);
        } finally {
          setIsSubmitting(false);
        }
      };
      submitTestResults();
    }
  }, [visionStatus, testResults, isSubmitting, submitSuccess, plates.length]);

  // --- RENDER LOGIC ---
  if (!plates.length) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Loading Test...</p>
        </div>
      </div>
    );
  }

  const currentPlate = plates[currentPlateIndex];
  const progress = ((currentPlateIndex + 1) / plates.length) * 100;
  const correctCount = testResults.filter((r) => r.isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => (window.location.href = "/user-dashboard")}
            className="flex items-center text-dark-red hover:text-deep-red transition-colors"
          >
            <FiHome className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FiEye className="mr-2 text-dark-red" />
            Ishihara Color Vision Test
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Plate {currentPlateIndex + 1} of {plates.length}
            </span>
            <span className="text-sm font-medium text-dark-red">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-dark-red h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {!isCompleted ? (
          /* Test Interface */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-md h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={currentPlate.imageSrc}
                    alt={`Ishihara Plate ${currentPlate.plateNumber}`}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {currentPlate.question}
                </label>
                <input
                  type="text"
                  id="answer"
                  value={currentUserInput}
                  onChange={(e) => setCurrentUserInput(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-red focus:border-dark-red text-center text-xl font-medium"
                  placeholder="Enter your answer"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentPlateIndex === 0}
                  className={`px-6 py-3 rounded-lg flex items-center ${
                    currentPlateIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-dark-red hover:bg-red-50"
                  }`}
                >
                  <FiArrowLeft className="mr-2" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-colors flex items-center"
                >
                  {currentPlateIndex === plates.length - 1
                    ? "Finish Test"
                    : "Next"}
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
            <div className="p-6 md:p-8 text-center">
              {isLoading && <p>Evaluating all answers with AI...</p>}
              {isSubmitting && <p>Submitting results...</p>}
              {submitError && (
                <p className="text-red-600">Error: {submitError}</p>
              )}
              {submitSuccess && (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Test Completed!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your color vision test results have been analyzed.
                  </p>
                  <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Diagnosis</p>
                      <p className="text-2xl font-bold text-dark-red">
                        {visionStatus}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Correct (Normal Vision)
                        </p>
                        <p className="text-3xl font-bold text-dark-red">
                          {correctCount}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Plates</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {plates.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResults(true)}
                    className="px-6 py-3 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-colors mb-4"
                  >
                    View Detailed Analysis
                  </button>
                </>
              )}
              <button
                onClick={() => (window.location.href = "/user-dashboard")}
                className="text-dark-red hover:underline flex items-center justify-center mx-auto"
              >
                <FiHome className="mr-2" />
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Detailed Results Modal */}
        {showResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full animate-fadeIn shadow-2xl overflow-hidden">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-800">
                  Detailed Test Analysis (AI-Powered)
                </h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-700">
                        Plate
                      </th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">
                        Your Answer
                      </th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">
                        AI Evaluation
                      </th>
                      <th className="text-left py-2 text-sm font-medium text-gray-700">
                        Reasoning (from AI)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-700">
                          #{result.plateNumber}
                        </td>
                        <td className="py-3 text-sm font-medium">
                          {result.userAnswer}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              result.evaluation === "Normal"
                                ? "bg-green-100 text-green-800"
                                : result.evaluation === "Incorrect"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.evaluation}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {result.reasoning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IshiharaTest;
