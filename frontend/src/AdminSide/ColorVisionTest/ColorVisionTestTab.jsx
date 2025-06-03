import React, { useState, useEffect } from 'react';
import './ColorVisionTest.css';
import TestResultCard from './TestResultCard';
import TestDetailModal from './TestDetailModal';
import axios from 'axios';

function ColorVisionTestTab() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Add this for debugging
      console.log('User:', JSON.parse(localStorage.getItem('user') || '{}')); // Add this for debugging
      
      const response = await axios.get('http://localhost:5000/api/colorvisiontest/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response:', response.data); // Add this for debugging
      setTestResults(response.data);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError(err.response?.data?.message || 'Failed to fetch test results');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (test) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const handleUpdateFollowUp = async (testId, followUpTests) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/colorvisiontest/${testId}/followup`,
        { followUpTests },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to update follow-up tests');
      }

      // Refresh the test results
      fetchTestResults();
    } catch (err) {
      console.error('Error updating follow-up tests:', err);
      setError(err.response?.data?.message || 'Failed to update follow-up tests');
    }
  };

  if (loading) return <div>Loading test results...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="color-vision-test-container">
      <h1>Color Vision Test Results</h1>
      <div className="test-results-grid">
        {testResults.map((test) => (
          <TestResultCard
            key={test._id}
            test={test}
            onViewMore={() => handleViewMore(test)}
          />
        ))}
      </div>
      {selectedTest && (
        <TestDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          test={selectedTest}
          onUpdateFollowUp={handleUpdateFollowUp}
        />
      )}
    </div>
  );
}

export default ColorVisionTestTab; 