import TestResult from "../models/TestResult.js";

// Get all test results for a patient
export const getTestResultsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const testResults = await TestResult.find({ patientId }).sort({ dateTaken: -1 });

    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching test results",
    });
  }
};

// Get test results by type for a patient
export const getTestResultsByType = async (req, res) => {
  try {
    const { patientId, testType } = req.params;
    const testResults = await TestResult.find({ 
      patientId, 
      testType 
    }).sort({ dateTaken: -1 });

    res.status(200).json(testResults);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching test results",
    });
  }
};

// Get a single test result by ID
export const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const testResult = await TestResult.findById(id);

    if (!testResult) {
      return res.status(404).json({
        status: "error",
        message: "Test result not found",
      });
    }

    res.status(200).json(testResult);
  } catch (error) {
    console.error("Error fetching test result:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching test result",
    });
  }
};

// Create a new test result
export const createTestResult = async (req, res) => {
  try {
    const testResult = await TestResult.create(req.body);
    res.status(201).json(testResult);
  } catch (error) {
    console.error("Error creating test result:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating test result",
    });
  }
};

// Update a test result
export const updateTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const testResult = await TestResult.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!testResult) {
      return res.status(404).json({
        status: "error",
        message: "Test result not found",
      });
    }

    res.status(200).json(testResult);
  } catch (error) {
    console.error("Error updating test result:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating test result",
    });
  }
};

// Delete a test result
export const deleteTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const testResult = await TestResult.findByIdAndDelete(id);
    
    if (!testResult) {
      return res.status(404).json({
        status: "error",
        message: "Test result not found",
      });
    }
    
    res.status(200).json({
      status: "success",
      message: "Test result deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting test result:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error deleting test result",
    });
  }
};
