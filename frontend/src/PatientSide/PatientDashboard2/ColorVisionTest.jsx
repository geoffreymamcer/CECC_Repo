import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

const ColorVisionTest = () => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [testRecords, setTestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColorVisionTests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }
        const response = await fetch(
          "http://localhost:5000/api/colorvisiontest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch color vision test records");
        }
        const data = await response.json();
        setTestRecords(data);
      } catch (err) {
        console.error("Error fetching color vision test records:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColorVisionTests();
  }, []);

  if (loading) {
    return (
      <div className="loading-message">
        Loading color vision test records...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!testRecords.length) {
    return (
      <div className="no-records-message">
        <p>No color vision test records found.</p>
        <button
          className="w-full mt-4 px-4 py-3 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all duration-200 flex items-center justify-center"
          onClick={() => navigate("/color-vision-test")}
        >
          Take New Color Vision Test
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </button>
      </div>
    );
  }

  // Use the most recent test record
  const latestTest = testRecords[0];

  // Prepare history for display (excluding the latest)
  const testHistory = testRecords;
  const hasFollowUps =
    latestTest.followUpTests &&
    Object.values(latestTest.followUpTests).some(Boolean);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Helper for follow-up test labels
  const followUpTestLabels = {
    ishihara: "Ishihara Test",
    farnsworth: "Farnsworth D-15",
    anomaloscope: "Anomaloscope Test",
    lantern: "Lantern Test",
    colorimetry: "Colorimetry Analysis",
  };

  // Get readable follow-ups
  const getRecommendedFollowUps = (followUpTests) => {
    if (!followUpTests) return [];
    return Object.entries(followUpTests)
      .filter(([_, val]) => val)
      .map(([test]) => followUpTestLabels[test] || test);
  };

  const recommendedFollowUps = getRecommendedFollowUps(
    latestTest.followUpTests
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiEye className="mr-2 text-dark-red" />
            Color Vision Test
          </h3>
          <p className="text-gray-600 mt-1">
            Last taken: {formatDate(latestTest.testDate)}
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-dark-red hover:underline"
        >
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      {/* Test Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Plates Correct</p>
            <p className="font-medium text-lg">
              {latestTest.correctPlates}/{latestTest.totalPlates}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Accuracy</p>
            <p className="font-medium text-lg">
              {Math.round(latestTest.accuracy)}%
              <span
                className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  latestTest.accuracy >= 90
                    ? "bg-green-100 text-green-800"
                    : latestTest.accuracy >= 80
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {latestTest.accuracy >= 90
                  ? "Excellent"
                  : latestTest.accuracy >= 80
                  ? "Good"
                  : "Needs Review"}
              </span>
            </p>
          </div>
        </div>
        <p className="font-medium">
          Result:{" "}
          {latestTest.testResult ||
            (latestTest.accuracy >= 90
              ? "Normal"
              : latestTest.accuracy >= 70
              ? "Mild"
              : latestTest.accuracy >= 50
              ? "Moderate"
              : "Severe")}
        </p>
        {/* Show notes if available */}
        {latestTest.notes && (
          <div className="test-notes mt-2">
            <h4 className="font-semibold">Notes</h4>
            <p>{latestTest.notes}</p>
          </div>
        )}
      </div>

      {/* Recommended Follow-ups */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FiAlertTriangle className="mr-1 text-yellow-500" />
          Recommended Follow-up Tests
        </h4>
        {recommendedFollowUps.length > 0 ? (
          <ul className="space-y-1">
            {recommendedFollowUps.map((test, index) => (
              <li key={index} className="flex items-center">
                <FiCheckCircle className="mr-2 text-green-500" />
                <span>{test}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-tests-message">
            No follow-up tests recommended at this time.
          </p>
        )}
      </div>

      {/* Test History */}
      {showHistory && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Previous Test Results
          </h4>
          <div className="space-y-3">
            {testHistory.slice(1).map((test, idx) => (
              <div
                key={test._id || test.id || idx}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {formatDate(test.testDate)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Score: </span>
                    <span>
                      {test.correctPlates}/{test.totalPlates}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Accuracy: </span>
                    <span>{Math.round(test.accuracy)}%</span>
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-gray-600">Result: </span>
                  <span>
                    {test.testResult ||
                      (test.accuracy >= 90
                        ? "Normal"
                        : test.accuracy >= 70
                        ? "Mild"
                        : test.accuracy >= 50
                        ? "Moderate"
                        : "Severe")}
                  </span>
                </div>
                {test.notes && (
                  <div className="test-notes mt-1">
                    <span className="font-semibold">Notes: </span>
                    <span>{test.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="w-full mt-4 px-4 py-3 bg-dark-red text-white rounded-lg hover:bg-deep-red transition-all duration-200 flex items-center justify-center"
        onClick={() => navigate("/color-vision-test")}
      >
        Take New Color Vision Test
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ColorVisionTest;
