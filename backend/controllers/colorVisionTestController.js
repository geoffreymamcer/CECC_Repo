import ColorVisionTest from "../models/ColorVisionTest.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new color vision test result
// @route   POST /api/colorvisiontest
// @access  Private (Patient)
const createColorVisionTest = asyncHandler(async (req, res) => {
  const { correctPlates, totalPlates, accuracy, testResult, clientTestId } =
    req.body;

  if (
    correctPlates === undefined ||
    totalPlates === undefined ||
    accuracy === undefined ||
    !testResult
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Get patientID from the authenticated user (using any available ID format)
  const patientID = req.user.patientId || req.user.id || req.user._id;

  console.log(`Creating color vision test for patient ID: ${patientID}`);

  if (!patientID) {
    console.error("Missing patient ID in user object:", req.user);
    res.status(400);
    throw new Error("Patient ID not found. Please log in again.");
  }

  // Fetch the patient's name from the User collection
  const user = await User.findById(patientID);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const patientName = `${user.firstName} ${
    user.middleName ? user.middleName + " " : ""
  }${user.lastName}`;

  // If a clientTestId is provided, check if we've already processed this test
  if (clientTestId) {
    // Use a custom field in the model to store the clientTestId
    // We'll check if this test has already been saved with this ID
    const existingTest = await ColorVisionTest.findOne({
      patientID,
      clientTestId,
    });

    if (existingTest) {
      console.log(
        `Test with clientTestId ${clientTestId} already exists, preventing duplicate`
      );
      return res.status(201).json(existingTest);
    }
  }

  // Create a new test record
  const colorVisionTest = await ColorVisionTest.create({
    patientID,
    patientName,
    correctPlates,
    totalPlates,
    accuracy,
    testResult,
    testDate: new Date(),
    clientTestId: clientTestId || null, // Store the clientTestId if provided
  });

  if (colorVisionTest) {
    res.status(201).json(colorVisionTest);
  } else {
    res.status(400);
    throw new Error("Invalid test data");
  }
});

// @desc    Get all color vision tests (Admin)
// @route   GET /api/colorvisiontest/admin/all
// @access  Private (Admin only)
const getAllColorVisionTests = asyncHandler(async (req, res) => {
  console.log("getAllColorVisionTests: Received request from user:", {
    id: req.user._id,
    role: req.user.role,
    email: req.user.email,
  });

  // Check if user is admin
  if (!req.user.isAdmin && req.user.role !== "admin") {
    console.log("getAllColorVisionTests: Access denied - not an admin");
    res.status(401);
    throw new Error("Not authorized as an admin");
  }

  console.log("getAllColorVisionTests: Fetching all test results");
  const colorVisionTests = await ColorVisionTest.find({}).sort({
    testDate: -1,
  });

  console.log(
    `getAllColorVisionTests: Found ${colorVisionTests.length} test results`
  );
  res.status(200).json(colorVisionTests);
});

// @desc    Get all color vision tests for a patient
// @route   GET /api/colorvisiontest
// @access  Private (Patient)
const getPatientColorVisionTests = asyncHandler(async (req, res) => {
  // Get patientID from the authenticated user (using any available ID format)
  const patientID = req.user.patientId || req.user.id || req.user._id;

  console.log(`Fetching color vision tests for patient ID: ${patientID}`);

  if (!patientID) {
    console.error("Missing patient ID in user object:", req.user);
    res.status(400);
    throw new Error("Patient ID not found. Please log in again.");
  }

  const colorVisionTests = await ColorVisionTest.find({ patientID }).sort({
    testDate: -1,
  });

  console.log(`Found ${colorVisionTests.length} color vision tests`);

  res.status(200).json(colorVisionTests);
});

// @desc    Get a specific color vision test
// @route   GET /api/colorvisiontest/:id
// @access  Private (Patient)
const getColorVisionTest = asyncHandler(async (req, res) => {
  const colorVisionTest = await ColorVisionTest.findById(req.params.id);

  if (!colorVisionTest) {
    res.status(404);
    throw new Error("Color vision test not found");
  }

  // Get patientID from the authenticated user (using any available ID format)
  const patientID = req.user.patientId || req.user.id || req.user._id;

  if (!patientID) {
    console.error("Missing patient ID in user object:", req.user);
    res.status(400);
    throw new Error("Patient ID not found. Please log in again.");
  }

  // Check if the test belongs to the authenticated patient or if user is admin
  if (colorVisionTest.patientID !== patientID && !req.user.isAdmin) {
    console.log(
      `Unauthorized access: Test belongs to ${colorVisionTest.patientID}, but user is ${patientID}`
    );
    res.status(401);
    throw new Error("Not authorized to access this test");
  }

  res.status(200).json(colorVisionTest);
});

// @desc    Update follow-up tests for a color vision test
// @route   PATCH /api/colorvisiontest/:id/followup
// @access  Private (Admin only)
const updateFollowUpTests = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { followUpTests } = req.body;

  console.log(
    "updateFollowUpTests: Updating test",
    id,
    "with follow-up tests:",
    followUpTests
  );

  // Check if user is admin
  if (!req.user.isAdmin && req.user.role !== "admin") {
    console.log("updateFollowUpTests: Access denied - not an admin");
    res.status(401);
    throw new Error("Not authorized as an admin");
  }

  const colorVisionTest = await ColorVisionTest.findById(id);

  if (!colorVisionTest) {
    console.log("updateFollowUpTests: Test not found:", id);
    res.status(404);
    throw new Error("Color vision test not found");
  }

  colorVisionTest.followUpTests = followUpTests;
  await colorVisionTest.save();

  console.log("updateFollowUpTests: Successfully updated follow-up tests");
  res.status(200).json(colorVisionTest);
});

export {
  createColorVisionTest,
  getAllColorVisionTests,
  getPatientColorVisionTests,
  getColorVisionTest,
  updateFollowUpTests,
};
