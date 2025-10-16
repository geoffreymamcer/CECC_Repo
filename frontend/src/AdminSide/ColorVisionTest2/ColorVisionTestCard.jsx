// src/components/ColorVisionTestCard.jsx
import React from "react";
import { FaEye } from "react-icons/fa";

// --- Logic copied from TestResultCard ---
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getResultStatus = (test) => {
  if (!test || !test.accuracy) return "unknown";
  const accuracy = parseFloat(test.accuracy);
  if (accuracy >= 90) return "normal";
  if (accuracy >= 70) return "mild";
  if (accuracy >= 50) return "moderate";
  return "severe";
};

const getResultText = (test) => {
  // Try to use testResult, fallback to result
  if (!test) return "Unknown";
  if (test.testResult) return test.testResult;
  if (test.result) return test.result;
  return "Unknown";
};
// --- End logic copy ---

const ColorVisionTestCard = ({ test, handleViewDetails }) => {
  // Determine badge color based on result
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

  // Determine accuracy color
  const getAccuracyColor = () => {
    const accuracy = parseInt(test.accuracy);
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-yellow-600";
    if (accuracy >= 60) return "text-orange-600";
    return "text-red-600";
  };

  // --- Use logic from TestResultCard for result status ---
  const resultStatus = getResultStatus(test);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {test.patientName}
            </h3>
            <p className="text-gray-600 text-sm">ID: {test.patientId}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}
          >
            {getResultText(test)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Test Date</p>
            <p className="font-medium">{formatDate(test.testDate)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Accuracy</p>
            <p className={`font-bold ${getAccuracyColor()}`}>
              {test.accuracy ? `${Math.round(test.accuracy)}%` : "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg col-span-2">
            <p className="text-xs text-gray-600">Correct Plates</p>
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {/* Use logic from TestResultCard if available */}
                {test.platesCorrect ||
                  `${test.correctPlates || 0}/${test.totalPlates || 0} correct`}
              </p>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-deep-red to-dark-red rounded-full"
                  style={{
                    width: `${
                      test.platesCorrect
                        ? (parseInt(test.platesCorrect.split("/")[0]) / 15) *
                          100
                        : test.totalPlates
                        ? ((test.correctPlates || 0) / test.totalPlates) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => handleViewDetails(test)}
            className="w-full px-4 py-2 bg-gradient-to-r from-deep-red to-dark-red text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center group"
          >
            <span>View Details</span>
            <FaEye className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorVisionTestCard;
