// src/pages/ColorVisionTest.jsx
import React, { useState, useEffect } from "react";
import ColorVisionTestCard from "./ColorVisionTestCard";
import ColorVisionTestDetailsModal from "./ColorVisionTestDetailsModal";
import axios from "axios";
import { FaEye, FaFileMedical, FaSearch } from "react-icons/fa";

const ColorVisionTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTestResults();
    // eslint-disable-next-line
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/colorvisiontest/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch test results");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (test) => {
    setSelectedTest(test);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
  };

  const handleSaveFollowUp = async (updatedTest) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/colorvisiontest/${updatedTest._id}/followup`,
        { followUpTests: updatedTest.followUpTests },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTestResults();
      setSelectedTest(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update follow-up tests"
      );
    }
  };

  // Filter tests based on search term
  const filteredTests = React.useMemo(() => {
    if (!searchTerm) return testResults;
    const term = searchTerm.toLowerCase();
    return testResults.filter(
      (test) =>
        (test.patientName && test.patientName.toLowerCase().includes(term)) ||
        (test.patientId && test.patientId.toLowerCase().includes(term)) ||
        (test.result && test.result.toLowerCase().includes(term))
    );
  }, [searchTerm, testResults]);

  // Count test results
  const resultCounts = React.useMemo(() => {
    return filteredTests.reduce((counts, test) => {
      counts[test.result] = (counts[test.result] || 0) + 1;
      return counts;
    }, {});
  }, [filteredTests]);

  if (loading) return <div>Loading test results...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 min-h-screen overflow-y-auto bg-gray-50">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaEye className="mr-3 text-deep-red" />
              Color Vision Test Results
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage color vision test outcomes
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="text-gray-400 absolute left-3 top-3" />
            </div>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Normal: {resultCounts["Normal"] || 0}</span>
          </div>
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Borderline: {resultCounts["Borderline"] || 0}</span>
          </div>
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>
              Deficient:{" "}
              {(resultCounts["Color Deficient"] || 0) +
                (resultCounts["Severe Deficiency"] || 0)}
            </span>
          </div>
          <div className="flex items-center text-sm bg-white px-4 py-2 rounded-full shadow">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Total: {filteredTests.length}</span>
          </div>
        </div>
      </div>

      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <ColorVisionTestCard
              key={test._id}
              test={test}
              handleViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-5xl mb-4 text-gray-300">
            <FaFileMedical />
          </div>
          <div className="text-xl font-medium text-gray-700">
            No matching tests found
          </div>
          <p className="text-gray-500 mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {selectedTest && (
        <ColorVisionTestDetailsModal
          test={selectedTest}
          handleCloseModal={handleCloseModal}
          handleSaveFollowUp={handleSaveFollowUp}
        />
      )}
    </div>
  );
};

export default ColorVisionTest;
