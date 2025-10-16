// src/components/ColorVisionTestDetailsModal.jsx
import React, { useState } from "react";
import { FaTimes, FaCheck, FaSave } from "react-icons/fa";
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

  // --- Use logic from TestDetailModal for result status ---
  const resultStatus = getResultStatus(test);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">Color Vision Test Details</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor()}`}
              >
                {test.result}
              </span>
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                Patient Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium">
                    {test.patientName || "Unknown Patient"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patient ID</p>
                  <p className="font-medium">
                    {test.patientId || test.patientID || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Date</p>
                  <p className="font-medium">{formatDate(test.testDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                Test Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className={`text-xl font-bold ${getAccuracyColor()}`}>
                    {test.accuracy ? `${Math.round(test.accuracy)}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Correct Plates</p>
                  <p className="text-xl font-bold text-deep-red">
                    {test.platesCorrect ||
                      `${test.correctPlates || 0}/${test.totalPlates || 0}`}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
                  <p className="text-sm text-gray-600">Performance</p>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-deep-red to-dark-red rounded-full"
                      style={{
                        width: test.accuracy
                          ? `${Math.round(test.accuracy)}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
              Plate-by-Plate Results
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {test.platesDetails &&
                test.platesDetails.map((plate, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                      plate.correct ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      Plate {plate.plate}
                    </span>
                    <span
                      className={`text-xl ${
                        plate.correct ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {plate.correct ? <FaCheck /> : <IoMdClose />}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
              Recommended Follow-up Tests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {followUpOptions.map((option) => (
                <div
                  key={option.key}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedTests[option.key]
                      ? "border-deep-red bg-red-50"
                      : "border-gray-200 hover:border-deep-red"
                  }`}
                  onClick={() => toggleTestSelection(option.key)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        selectedTests[option.key]
                          ? "border-deep-red bg-deep-red"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedTests[option.key] && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCloseModal}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-opacity duration-200 flex items-center"
            >
              <FaSave className="mr-2" /> Save Follow-up Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorVisionTestDetailsModal;
