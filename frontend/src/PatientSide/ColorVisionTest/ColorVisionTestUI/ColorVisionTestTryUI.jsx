// src/components/ColorVisionTestTryUI.jsx
import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiEye,
  FiCheckCircle,
  FiActivity,
  FiRefreshCcw,
} from "react-icons/fi";
import { ishiharaTestPlatesConsistent } from "./questionsList"; // Ensure this is the correct path
import { GoogleGenerativeAI } from "@google/generative-ai";
import instance from "../../../api/axios";

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
    // Step 2: Once AI results are processed, submit to the backend.
    if (visionStatus && !submitSuccess && !isSubmitting) {
      const submitTestResults = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        const correctPlates = testResults.filter((r) => r.isCorrect).length;
        const totalPlates = plates.length;
        const accuracy = Math.round((correctPlates / totalPlates) * 100);

        try {
          const token = localStorage.getItem("token"); // Still good to check for token existence
          if (!token)
            throw new Error("Authentication required to save results.");

          const payload = {
            answers: testResults.map((r) => r.userAnswer),
            correctPlates,
            totalPlates,
            accuracy,
            testResult: visionStatus,
            plateResults: testResults,
            testDate: new Date().toISOString(),
          };

          // --- 2. REPLACE FETCH WITH API.POST ---
          // The Authorization header is handled automatically by the axios instance.
          const response = await instance.post("/colorvisiontest", payload);

          // axios throws an error on non-2xx status, so no need for `if (!response.ok)`
          console.log("Test result saved:", response.data);
          setSubmitSuccess(true);
        } catch (err) {
          console.error("Failed to save test result to backend:", err);
          setSubmitError(
            err.response?.data?.message ||
              err.message ||
              "Failed to save test result"
          );
        } finally {
          setIsSubmitting(false);
        }
      };
      submitTestResults();
    }
  }, [visionStatus, testResults, isSubmitting, submitSuccess, plates.length]);

  if (!plates.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#7F0000]"></div>
          <p className="text-lg text-gray-600 mt-4 font-medium">
            Preparing your test...
          </p>
        </div>
      </div>
    );
  }

  const currentPlate = plates[currentPlateIndex];
  const progress = ((currentPlateIndex + 1) / plates.length) * 100;
  const correctCount = testResults.filter((r) => r.isCorrect).length;

  return (
    <div className="min-h-screen w-full bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col">
      {/* Header Navigation */}
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        <button
          onClick={() => (window.location.href = "/user-dashboard")}
          className="group flex items-center text-gray-500 hover:text-[#7F0000] transition-colors font-medium"
        >
          <span className="bg-white p-2 rounded-full shadow-sm mr-2 group-hover:shadow-md transition-all">
            <FiHome className="w-5 h-5" />
          </span>
          Dashboard
        </button>
        <div className="text-center hidden md:block">
          <h2 className="text-gray-800 font-bold">Ishihara Color Test</h2>
          <p className="text-xs text-gray-500">Standardized Assessment</p>
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-2xl">
          {!isCompleted ? (
            /* --- ACTIVE TEST INTERFACE --- */
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative animate-fadeIn">
              {/* Progress Bar Header */}
              <div className="px-8 pt-8 pb-2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Plate {currentPlateIndex + 1}{" "}
                    <span className="font-normal text-gray-300">
                      / {plates.length}
                    </span>
                  </span>
                  <span className="text-[#7F0000] font-bold">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#7F0000] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-8 flex flex-col items-center">
                {/* Plate Display - Clean & Focused */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#7F0000]/5 rounded-full filter blur-xl transform scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-center border border-gray-50 p-4">
                    <img
                      src={currentPlate.imageSrc}
                      alt={`Plate ${currentPlate.plateNumber}`}
                      className="w-full h-full object-contain transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Question & Input */}
                <div className="w-full max-w-md mt-8 text-center">
                  <label
                    htmlFor="answer"
                    className="block text-lg font-medium text-gray-700 mb-4"
                  >
                    {currentPlate.question}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      id="answer"
                      value={currentUserInput}
                      onChange={(e) => setCurrentUserInput(e.target.value)}
                      className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold tracking-widest text-gray-800 focus:outline-none focus:border-[#7F0000] focus:bg-white focus:ring-4 focus:ring-[#7F0000]/10 transition-all placeholder-gray-300"
                      placeholder="Type here..."
                      autoComplete="off"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                      <FiEye size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={handlePrev}
                  disabled={currentPlateIndex === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    currentPlateIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <FiArrowLeft /> Prev
                </button>

                <div className="text-xs text-gray-400 font-medium">
                  Press{" "}
                  <span className="border border-gray-300 px-1 rounded bg-white text-gray-500">
                    Enter
                  </span>{" "}
                  to submit
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-[#7F0000] text-white rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#600000] hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {currentPlateIndex === plates.length - 1 ? "Finish" : "Next"}{" "}
                  <FiArrowRight />
                </button>
              </div>
            </div>
          ) : (
            /* --- RESULTS INTERFACE --- */
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn">
              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#7F0000] mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Analyzing Your Vision
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Our AI is evaluating your responses against standard
                    Ishihara patterns...
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-[#7F0000] to-[#5a0000] p-10 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4 shadow-inner border border-white/20">
                        <FiActivity className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2">
                        Assessment Complete
                      </h2>
                      <p className="text-white/80">
                        Result:{" "}
                        <strong className="text-white">{visionStatus}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-green-50 p-5 rounded-2xl border border-green-100 text-center">
                        <span className="block text-3xl font-extrabold text-green-700">
                          {correctCount}
                        </span>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide">
                          Correct Plates
                        </span>
                      </div>
                      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
                        <span className="block text-3xl font-extrabold text-blue-700">
                          {plates.length}
                        </span>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                          Total Plates
                        </span>
                      </div>
                    </div>

                    {submitError && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm text-center">
                        {submitError}
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setShowResults(true)}
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <FiEye /> View Detailed Report
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FiRefreshCcw /> Retake Test
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Results Modal - Modernized */}
      {showResults && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-scaleIn">
            <div className="border-b border-gray-100 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Detailed Clinical Analysis
                </h3>
                <p className="text-sm text-gray-500">
                  AI-Powered evaluation per plate
                </p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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

            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Plate
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Your Answer
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Analysis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testResults.map((result, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        #{result.plateNumber}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-mono bg-gray-50/50">
                        {result.userAnswer || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            result.evaluation === "Normal"
                              ? "bg-green-100 text-green-800"
                              : result.evaluation === "Incorrect"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.evaluation === "Normal" && (
                            <FiCheckCircle className="mr-1" />
                          )}
                          {result.evaluation}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 leading-relaxed">
                        {result.reasoning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl text-center">
              <button
                onClick={() => setShowResults(false)}
                className="text-[#7F0000] font-bold text-sm hover:underline"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IshiharaTest;
