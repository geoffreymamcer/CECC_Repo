// src/components/ColorVisionTestTryUI.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiEye,
  FiCheckCircle,
  FiActivity,
  FiRefreshCcw,
  FiMic,
  FiUsers,
  FiMicOff,
  FiSun,
  FiMaximize,
  FiAlertTriangle,
} from "react-icons/fi";
import { ishiharaTestPlatesConsistent } from "./questionsList";
import { GoogleGenerativeAI } from "@google/generative-ai";
import instance from "../../../api/axios";
import DistanceMonitor from "./DistanceMonitor";

// --- HELPERS ---

const numberWords = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  nothing: "nothing",
  none: "nothing",
};
const checkAnswerLocally = (userInput, correctAnswer) => {
  if (!userInput || !correctAnswer) return false;

  // 1. Normalize strings
  const normalize = (str) =>
    str
      .toString()
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove punctuation
      .trim();

  let cleanInput = normalize(userInput);
  let cleanCorrect = normalize(correctAnswer);

  // 2. Dynamic Word Replacement
  // This handles "I see twelve" -> "I see 12"
  Object.keys(numberWords).forEach((word) => {
    // Regex matches the whole word only (\b) to avoid replacing inside other words
    const regex = new RegExp(`\\b${word}\\b`, "g");
    cleanInput = cleanInput.replace(regex, numberWords[word]);
  });

  // 3. Extract Digits
  const inputNum = cleanInput.match(/\d+/);
  const correctNum = cleanCorrect.match(/\d+/);

  // 4. Comparison Logic
  if (inputNum && correctNum) {
    // Both have numbers? Compare the numbers (e.g. "12" === "12")
    return inputNum[0] === correctNum[0];
  } else if (
    cleanInput.includes("nothing") &&
    cleanCorrect.includes("nothing")
  ) {
    // Handle "nothing" case explicitly
    return true;
  }

  // Fallback: If no numbers found (e.g. "Line"), compare normalized strings
  return cleanInput === cleanCorrect;
};

function determineVisionStatus(resultsArray) {
  const plate1 = resultsArray.find((r) => r.plateNumber === 1);
  if (
    plate1 &&
    (plate1.evaluation === "Incorrect" || plate1.evaluation === "Malingering")
  ) {
    return "Test Inconclusive (Control Plate Missed)";
  }

  const totalQuestions = resultsArray.length;
  const normalVisionCount = resultsArray.filter(
    (r) => r.evaluation === "Normal"
  ).length;
  const protanopiaCount = resultsArray.filter(
    (r) => r.evaluation === "Protanopia"
  ).length;
  const deuteranopiaCount = resultsArray.filter(
    (r) => r.evaluation === "Deuteranopia"
  ).length;
  const malingeringCount = resultsArray.filter(
    (r) => r.evaluation === "Malingering"
  ).length;
  const totalColorBlindnessCount = resultsArray.filter(
    (r) => r.totalColorBlindnessAnswer === r.userAnswer
  ).length;

  if (totalQuestions <= 7 && normalVisionCount === totalQuestions) {
    return "Normal Color Vision";
  }

  const normalVisionPercentage = (normalVisionCount / totalQuestions) * 100;

  if (normalVisionPercentage >= 90) {
    return "Normal Color Vision";
  } else if (normalVisionPercentage >= 70) {
    if (protanopiaCount > deuteranopiaCount)
      return "Mild Protanopia (Red-Blind)";
    if (deuteranopiaCount > protanopiaCount)
      return "Mild Deuteranopia (Green-Blind)";
    return "Mild Color Vision Deficiency";
  } else {
    if (malingeringCount > 2)
      return "Results Inconsistent (Possible Malingering)";
    if (totalColorBlindnessCount >= totalQuestions * 0.8)
      return "Total Color Blindness";
    if (protanopiaCount > deuteranopiaCount)
      return "Severe Protanopia (Red-Blind)";
    if (deuteranopiaCount > protanopiaCount)
      return "Severe Deuteranopia (Green-Blind)";
    return "Severe Color Vision Deficiency";
  }
}

// --- MAIN COMPONENT ---

const IshiharaTest = () => {
  const [plates, setPlates] = useState([]);
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [currentUserInput, setCurrentUserInput] = useState("");
  const [testAnswers, setTestAnswers] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visionStatus, setVisionStatus] = useState("");

  const [testPhase, setTestPhase] = useState("viewing"); // 'viewing' | 'answering'
  const [timeLeft, setTimeLeft] = useState(5); // 5 Seconds exposure time

  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const startTimeRef = useRef(null);

  const [isDistanceCorrect, setIsDistanceCorrect] = useState(true); // Default true to prevent flicker on load
  const [distanceStatus, setDistanceStatus] = useState("OK");

  const handleDistanceChange = useCallback((isValid, status) => {
    setIsDistanceCorrect(isValid);
    setDistanceStatus(status);
  }, []);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  useEffect(() => {
    setPlates(ishiharaTestPlatesConsistent);
  }, []);

  useEffect(() => {
    if (isCalibrated && !isCompleted) {
      startTimeRef.current = Date.now();
      setCurrentUserInput("");
    }
  }, [currentPlateIndex, isCalibrated, isCompleted]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCurrentUserInput(transcript.replace(/\.$/, ""));
    };
    recognition.start();
  }, []);

  const evaluateAllAnswersWithGemini = async (answers) => {
    setIsLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // 1️⃣ START MODIFICATION: Updated Prompt for Tier 2 Logic
    const answersPrompt = answers
      .map(
        (answer) => `
      {
        "plateNumber": ${answer.plate.plateNumber},
        "userAnswer": "${answer.userAnswer}",
        "timeTakenSeconds": ${(answer.timeTaken / 1000).toFixed(1)},
        "normalVisionAnswer": "${answer.plate.normalVisionAnswer}",
        "protanopiaAnswer": "${answer.plate.protanopiaAnswer || "N/A"}",
        "deuteranopiaAnswer": "${answer.plate.deuteranopiaAnswer || "N/A"}"
      }
    `
      )
      .join(",\n");

    const prompt = `
      You are an expert Optometrist interpreting an Ishihara Color Vision test.
      
      **Protocol Context:**
      - **Tier 1 (Screening):** Test may end at Plate 7 if user is Normal.
      - **Tier 2 (Diagnosis):** Test may end at Plate 25. Plates 26-38 (winding lines) are omitted for literate users.
      
      **Timing:** Normal response < 3s. Hesitation > 5s suggests deficiency.

      **Task:**
      Analyze the JSON array. Return a JSON array:
      - "plateNumber": integer
      - "evaluation": "Normal", "Protanopia", "Deuteranopia", "Incorrect", "Malingering"
      - "reasoning": string explanation
      - "confidence": number (0-10)

      User Data:
      [${answersPrompt}]
    `;
    // 1️⃣ END MODIFICATION

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const jsonText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const evaluatedResults = JSON.parse(jsonText);

      const finalResults = answers.map((answer) => {
        const aiResult = evaluatedResults.find(
          (r) => r.plateNumber === answer.plate.plateNumber
        ) || {
          evaluation: "Incorrect",
          reasoning: "AI evaluation failed.",
          confidence: 0,
        };

        return {
          plateNumber: answer.plate.plateNumber,
          userAnswer: answer.userAnswer,
          imageSrc: answer.plate.imageSrc,
          question: answer.plate.question,
          timeTaken: answer.timeTaken,
          normalVisionAnswer: answer.plate.normalVisionAnswer,
          protanopiaAnswer: answer.plate.protanopiaAnswer,
          deuteranopiaAnswer: answer.plate.deuteranopiaAnswer,
          totalColorBlindnessAnswer:
            answer.plate.totalColorBlindnessAnswer || "N/A",
          evaluation: aiResult.evaluation,
          reasoning: aiResult.reasoning,
          confidence: aiResult.confidence,
          isCorrect: aiResult.evaluation === "Normal",
          isMalingering: aiResult.evaluation === "Malingering",
        };
      });

      setTestResults(finalResults);

      if (
        answers.length <= 7 &&
        finalResults.every((r) => r.evaluation === "Normal")
      ) {
        setVisionStatus("Normal Color Vision");
      } else {
        setVisionStatus(determineVisionStatus(finalResults));
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      setSubmitError("AI Service Busy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!currentUserInput.trim()) {
      alert("Please enter or say what you see.");
      return;
    }

    const currentPlate = plates[currentPlateIndex];
    const timeTaken = Date.now() - (startTimeRef.current || Date.now());

    const newAnswer = {
      plate: currentPlate,
      userAnswer: currentUserInput,
      timeTaken: timeTaken,
    };

    const updatedAnswers = [...testAnswers, newAnswer];
    setTestAnswers(updatedAnswers);
    setCurrentUserInput("");

    // 2️⃣ START MODIFICATION: Tier 1 & Tier 2 Stopping Logic

    // --- TIER 1 CHECK (Plate 7 / Index 6) ---
    // Rule: If first 7 are perfect and fast, stop (Screening Passed).
    if (currentPlateIndex === 6) {
      const screeningAnswers = updatedAnswers.slice(0, 7);

      const hasErrors = screeningAnswers.some((ans) => {
        // Strict check: User input must match Normal Vision answer locally
        return !checkAnswerLocally(
          ans.userAnswer,
          ans.plate.normalVisionAnswer
        );
      });

      const totalTime = screeningAnswers.reduce(
        (sum, a) => sum + a.timeTaken,
        0
      );
      const avgTime = totalTime / 7;
      const hasHesitation = avgTime > 6000;

      if (!hasErrors && !hasHesitation) {
        console.log("Tier 1 (Screening) Passed. Stopping.");
        setIsCompleted(true);
        return;
      }
    }

    // --- TIER 2 CHECK (Plate 25 / Index 24) ---
    // Rule: If we reach Plate 25, we have finished all Numeric plates.
    // Plates 26-38 are "Winding Lines" intended for illiterates.
    // Since user has been typing/speaking numbers for 25 plates, they are literate.
    // We have enough data to classify Protan/Deutan (Plates 22-25) or confirm Normal (slow).
    if (currentPlateIndex === 24) {
      console.log(
        "Tier 2 (Diagnosis) Complete. Stopping before Winding Lines."
      );
      // We stop here regardless of result. The AI will analyze the 25 plates.
      // Going further adds no diagnostic value for this input method.
      setIsCompleted(true);
      return;
    }

    // 2️⃣ END MODIFICATION

    if (currentPlateIndex < plates.length - 1) {
      setCurrentPlateIndex(currentPlateIndex + 1);

      // Reset Phase and Timer
      setTestPhase("viewing");
      setTimeLeft(5); // Reset to 5 seconds
      setCurrentUserInput("");
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentPlateIndex > 0) {
      setCurrentPlateIndex(currentPlateIndex - 1);
      const newAnswers = [...testAnswers];
      newAnswers.pop();
      setTestAnswers(newAnswers);
    }
  };

  useEffect(() => {
    if (isCompleted) {
      evaluateAllAnswersWithGemini(testAnswers);
    }
  }, [isCompleted, testAnswers]);

  useEffect(() => {
    if (visionStatus && !submitSuccess && !isSubmitting) {
      const submitTestResults = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        const correctPlates = testResults.filter((r) => r.isCorrect).length;
        const totalPlates = testResults.length;
        const accuracy = Math.round((correctPlates / totalPlates) * 100);

        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Authentication missing.");

          const payload = {
            plateResults: testResults.map((r) => ({
              plateNumber: r.plateNumber,
              userAnswer: r.userAnswer,
              imageSrc: r.imageSrc,
              question: r.question,
              evaluation: r.evaluation,
              reasoning: r.reasoning,
              isCorrect: r.isCorrect,
              responseTime: r.timeTaken ? r.timeTaken / 1000 : 0,
              inputMethod: "text",
              normalVisionAnswer: r.normalVisionAnswer,
              protanopiaAnswer: r.protanopiaAnswer,
              deuteranopiaAnswer: r.deuteranopiaAnswer,
            })),
            correctPlates,
            totalPlates,
            accuracy,
            testResult: visionStatus,
            testDate: new Date().toISOString(),
          };

          const response = await instance.post("/colorvisiontest", payload);
          setSubmitSuccess(true);
        } catch (err) {
          console.error("Save Error:", err);
          setSubmitError(
            err.response?.data?.message || "Failed to save results"
          );
        } finally {
          setIsSubmitting(false);
        }
      };
      submitTestResults();
    }
  }, [visionStatus, testResults, isSubmitting, submitSuccess]);

  useEffect(() => {
    let timer;

    // Only run timer if we are in viewing phase, calibrated, and not paused by distance/completed
    if (
      testPhase === "viewing" &&
      !isCompleted &&
      isCalibrated &&
      isDistanceCorrect // Don't count down if they are leaning in/paused!
    ) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      } else {
        // Time is up! Switch to answering
        setTestPhase("answering");
        // Reset latency timer so we measure Reaction Time from the moment input appears
        startTimeRef.current = Date.now();
      }
    }

    return () => clearTimeout(timer);
  }, [timeLeft, testPhase, isCompleted, isCalibrated, isDistanceCorrect]);

  // --- UI RENDER (Unchanged) ---
  if (!isCalibrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSun className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Device Calibration
          </h2>
          <p className="text-gray-500 mb-8">
            To ensure clinical accuracy, please prepare your environment.
          </p>
          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiMaximize className="w-5 h-5 text-[#7F0000] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">
                  Set Brightness to 100%
                </p>
                <p className="text-xs text-gray-500">
                  Dim screens cause false positives.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FiEye className="w-5 h-5 text-[#7F0000] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Distance Check</p>
                <p className="text-xs text-gray-500">
                  Hold device at arm's length (approx. 75cm).
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCalibrated(true)}
            className="w-full py-4 bg-[#7F0000] text-white rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#600000] transition-all"
          >
            I'm Ready
          </button>
        </div>
      </div>
    );
  }

  if (!plates.length) return <div className="p-10 text-center">Loading...</div>;

  const progress = ((currentPlateIndex + 1) / plates.length) * 100;
  const currentPlate = plates[currentPlateIndex];

  return (
    <div className="min-h-screen w-full bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] flex flex-col">
      <div className="w-full max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        <button
          onClick={() => (window.location.href = "/user-dashboard")}
          className="flex items-center text-gray-500 hover:text-[#7F0000] font-medium"
        >
          <FiHome className="mr-2" /> Dashboard
        </button>
        <div className="text-center hidden md:block">
          <h2 className="text-gray-800 font-bold">Ishihara Color Test</h2>
          <p className="text-xs text-gray-500">Clinical Standard Protocol</p>
        </div>
        <div className="w-24"></div>
      </div>

      <div className="fixed bottom-4 right-4 z-50 md:top-24 md:right-8 md:bottom-auto">
        {/* Only show monitor during the active test */}
        {!isCompleted && isCalibrated && (
          <DistanceMonitor onDistanceChange={handleDistanceChange} />
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-2xl">
          {!isCompleted ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative animate-fadeIn">
              <div className="px-8 pt-8 pb-2">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                    Plate {currentPlateIndex + 1}
                    <span className="font-normal text-gray-300">
                      / {plates.length}
                    </span>
                  </span>
                  <span className="text-[#7F0000] font-bold">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-2">
                  {testPhase === "viewing" ? (
                    // Countdown Bar (Shrinking)
                    <div
                      className="bg-yellow-500 h-full rounded-full transition-all duration-1000 linear"
                      style={{ width: `${(timeLeft / 5) * 100}%` }} // 5 is max time
                    ></div>
                  ) : (
                    // Progress Bar (Fixed)
                    <div
                      className="bg-[#7F0000] h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
              </div>

              <div className="p-8 flex flex-col items-center">
                {testPhase === "viewing" ? (
                  <div className="animate-fadeIn flex flex-col items-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full shadow-inner flex items-center justify-center border border-gray-50 p-4">
                      {/* The Plate Image */}
                      <img
                        src={currentPlate.imageSrc}
                        alt="Ishihara Plate"
                        className="w-full h-full object-contain pointer-events-none select-none"
                      />
                    </div>

                    {/* The Countdown Text */}
                    <div className="mt-8 text-center">
                      <p className="text-gray-500 font-medium uppercase tracking-wide text-sm">
                        Memorize the number
                      </p>
                      <p className="text-5xl font-extrabold text-[#7F0000] mt-3 tabular-nums">
                        {timeLeft}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeIn flex flex-col items-center w-full">
                    {/* Visual Indicator that image is hidden */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gray-50 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center p-4">
                      <FiEye className="w-12 h-12 text-gray-300" />
                      <span className="absolute mt-16 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Image Hidden
                      </span>
                    </div>

                    <div className="w-full max-w-md mt-8 text-center relative">
                      <label className="block text-lg font-medium text-gray-700 mb-4 animate-pulse">
                        What number did you see?
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={currentUserInput}
                          onChange={(e) => setCurrentUserInput(e.target.value)}
                          className="w-full p-4 pl-6 pr-14 bg-white border-2 border-gray-200 rounded-2xl text-center text-2xl font-bold tracking-widest text-gray-800 focus:outline-none focus:border-[#7F0000] focus:ring-4 focus:ring-[#7F0000]/10 transition-all placeholder-gray-300 shadow-sm"
                          placeholder="Type here..."
                          autoFocus // Automatically focuses so user can type immediately
                          autoComplete="off"
                          onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        />

                        {/* Microphone Button */}
                        <button
                          onClick={startListening}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
                            isListening
                              ? "bg-red-100 text-red-600 animate-pulse ring-2 ring-red-200"
                              : "text-gray-400 hover:text-[#7F0000] hover:bg-gray-50"
                          }`}
                          title="Speak Answer"
                        >
                          {isListening ? (
                            <FiMicOff size={24} />
                          ) : (
                            <FiMic size={24} />
                          )}
                        </button>
                      </div>

                      {isListening && (
                        <p className="text-xs text-red-500 mt-2 font-medium">
                          Listening... Speak the number clearly.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={handlePrev}
                  disabled={currentPlateIndex === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold ${
                    currentPlateIndex === 0
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FiArrowLeft /> Prev
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-[#7F0000] text-white rounded-xl font-bold shadow-lg hover:bg-[#600000] transition-all"
                >
                  {currentPlateIndex === plates.length - 1 ? "Finish" : "Next"}{" "}
                  <FiArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#7F0000] mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Analyzing Vision...
                  </h3>
                </div>
              ) : (
                <>
                  <div
                    className={`bg-gradient-to-br p-10 text-center text-white ${
                      visionStatus.includes("Normal")
                        ? "from-green-700 to-green-900"
                        : "from-[#7F0000] to-[#5a0000]"
                    }`}
                  >
                    <FiActivity className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-bold mb-2">
                      Diagnosis Complete
                    </h2>
                    <p className="text-white/90 text-lg">{visionStatus}</p>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                        <span className="block text-2xl font-bold text-gray-800">
                          {testResults.filter((r) => r.isCorrect).length}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase">
                          Correct
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                        <span className="block text-2xl font-bold text-gray-800">
                          {testResults.length}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase">
                          Tested
                        </span>
                      </div>
                    </div>

                    {submitError && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-4 text-center text-sm">
                        {submitError}
                      </div>
                    )}

                    <button
                      onClick={() => setShowResults(true)}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold mb-3 flex justify-center gap-2"
                    >
                      <FiEye /> Detailed Report
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold flex justify-center gap-2"
                    >
                      <FiRefreshCcw /> Retake Test
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {isCalibrated && !isDistanceCorrect && (
            <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
              <div className="bg-red-50 p-6 rounded-full mb-4 animate-bounce">
                {distanceStatus === "MULTIPLE_FACES" ? (
                  <FiUsers className="w-12 h-12 text-red-600" />
                ) : (
                  <FiAlertTriangle className="w-12 h-12 text-red-600" />
                )}{" "}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {distanceStatus === "TOO_CLOSE"
                  ? "You are too close!"
                  : distanceStatus === "TOO_FAR"
                  ? "You are too far away!"
                  : distanceStatus === "MULTIPLE_FACES"
                  ? "Multiple People Detected!"
                  : "Face Not Detected"}
              </h3>

              <p className="text-gray-600 max-w-xs">
                {distanceStatus === "MULTIPLE_FACES" ? (
                  <span>
                    To ensure clinical validity,{" "}
                    <strong>you must be alone</strong> during the test.
                  </span>
                ) : (
                  <span>
                    Please maintain a distance of approximately{" "}
                    <strong>75cm (arm's length)</strong> to ensure accurate
                    color perception.
                  </span>
                )}
              </p>
              {/* 4️⃣ END MODIFICATION */}

              <p className="text-sm text-red-500 font-bold mt-4 uppercase tracking-wide">
                Test Paused
              </p>
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="border-b border-gray-100 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Clinical Report</h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Plate
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Answer
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testResults.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="p-4 text-sm font-medium">
                        #{r.plateNumber}
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-mono">
                        {r.userAnswer}
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {r.timeTaken
                          ? `${(r.timeTaken / 1000).toFixed(1)}s`
                          : "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            r.evaluation === "Normal"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.evaluation}
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {r.reasoning}
                        </div>
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
  );
};

export default IshiharaTest;
