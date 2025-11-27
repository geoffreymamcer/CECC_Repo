// src/components/ColorVisionTestDetailsModal.jsx
import React, { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// --- Logic copied from TestDetailModal ---
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const followUpTestKeys = [
  "ishihara",
  "farnsworth",
  "anomaloscope",
  "lantern",
  "colorimetry",
];

const followUpOptions = [
  { key: "anomaloscope", label: "Anomaloscope Test" },
  { key: "colorimetry", label: "Colorimetry Analysis" },
  { key: "farnsworth", label: "Farnsworth D-15" },
  { key: "lantern", label: "Lantern Test" },
  { key: "ishihara", label: "Ishihara Test" }, // add if needed
];

const getResultStatus = (test) => {
  if (!test || !test.accuracy) return "unknown";
  const accuracy = parseFloat(test.accuracy);
  if (accuracy >= 90) return "normal";
  if (accuracy >= 70) return "mild";
  if (accuracy >= 50) return "moderate";
  return "severe";
};
// --- End logic copy ---

const ColorVisionTestDetailsModal = ({
  test,
  handleCloseModal,
  handleSaveFollowUp,
}) => {
  const [selectedTests, setSelectedTests] = useState(() => {
    // If test.followUpTests is already an object, use it; otherwise, create default
    if (
      test.followUpTests &&
      typeof test.followUpTests === "object" &&
      !Array.isArray(test.followUpTests)
    ) {
      return test.followUpTests;
    }
    // Default: all false
    const obj = {};
    followUpOptions.forEach((opt) => {
      obj[opt.key] = false;
    });
    return obj;
  });

  const toggleTestSelection = (testKey) => {
    setSelectedTests((prev) => ({
      ...prev,
      [testKey]: !prev[testKey],
    }));
  };
  const handleSave = () => {
    const updatedTest = { ...test, followUpTests: selectedTests };
    handleSaveFollowUp(updatedTest);
  };

  // Determine badge color based on result (keep your design)
  const getBadgeColor = () => {
    switch (test.result) {
      case "Normal":
        return "bg-green-100 text-green-800";
      case "Borderline":
        return "bg-yellow-100 text-yellow-800";
      case "Color Deficient":
        return "bg-orange-100 text-orange-800";
      case "Severe Deficiency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Determine accuracy color (keep your design)
  const getAccuracyColor = () => {
    const accuracy = parseInt(test.accuracy);
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-yellow-600";
    if (accuracy >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const plateResults = test.plateResults || test.platesDetails || [];

  // --- Use logic from TestDetailModal for result status ---
  const resultStatus = getResultStatus(test);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-scaleIn shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Color Vision Assessment
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getBadgeColor()}`}
              >
                {test.testResult || test.result}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {test._id}</p>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info Card */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Patient Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="font-bold text-gray-900">
                    {test.patientName || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Patient ID</span>
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-gray-200">
                    {test.patientID || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(test.testDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 lg:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Test Performance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Accuracy</p>
                  <p
                    className={`text-4xl font-extrabold ${getAccuracyColor()}`}
                  >
                    {test.accuracy ? Math.round(test.accuracy) : 0}
                    <span className="text-xl">%</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Correct Plates</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {test.correctPlates}/{test.totalPlates}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-sm text-gray-500 mb-2">Visual Summary</p>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        parseInt(test.accuracy) >= 90
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${test.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 👇 🤖 EMOJI: MODIFIED - Plate-by-Plate Results with Images */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#7F0000] rounded-full"></span>
              Detailed Analysis
            </h3>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:gap-px bg-gray-100">
                {plateResults.map((plate, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 flex flex-col gap-3 relative group hover:z-10 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Plate #{plate.plateNumber}
                      </span>
                      {plate.isCorrect ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaExclamationTriangle className="text-red-500" />
                      )}
                    </div>

                    <div className="flex gap-4 items-center">
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        {plate.imageSrc ? (
                          <img
                            src={plate.imageSrc}
                            alt={`Plate ${plate.plateNumber}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">
                          Patient Saw:
                        </p>
                        <p
                          className={`font-mono text-lg font-bold truncate ${
                            plate.isCorrect ? "text-gray-900" : "text-red-600"
                          }`}
                        >
                          {plate.userAnswer || "-"}
                        </p>
                        {!plate.isCorrect && (
                          <p className="text-[10px] text-green-600 font-medium mt-1">
                            Expected:{" "}
                            {plate.normalVisionAnswer || plate.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tooltip for AI Reasoning (Optional enhancement) */}
                    {plate.reasoning && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 leading-relaxed">
                        {plate.reasoning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 👆 🤖 EMOJI: END CHANGE */}

          {/* Recommendation Section */}
          <div className="bg-[#7F0000]/5 border border-[#7F0000]/10 rounded-2xl p-6">
            <h3 className="font-bold text-[#7F0000] mb-4 flex items-center gap-2">
              <span className="bg-[#7F0000] text-white rounded p-1 text-xs">
                <FaSave />
              </span>
              Clinical Recommendations
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select follow-up tests recommended for this patient based on the
              results above.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {followUpOptions.map((option) => (
                <label
                  key={option.key}
                  className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedTests[option.key]
                      ? "border-[#7F0000] bg-white shadow-md"
                      : "border-gray-200 hover:border-gray-300 bg-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedTests[option.key] || false}
                    onChange={() => toggleTestSelection(option.key)}
                  />
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                      selectedTests[option.key]
                        ? "bg-[#7F0000] border-[#7F0000] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <FaCheck className="w-3 h-3" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      selectedTests[option.key]
                        ? "text-[#7F0000]"
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 z-10">
          <button
            onClick={handleCloseModal}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#7F0000] text-white font-bold rounded-xl hover:bg-[#600000] shadow-lg shadow-red-900/20 transition-all flex items-center gap-2"
          >
            <FaSave /> Save Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorVisionTestDetailsModal;
