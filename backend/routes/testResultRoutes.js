import express from "express";
import {
  getTestResultsByPatientId,
  getTestResultsByType,
  getTestResultById,
  createTestResult,
  updateTestResult,
  deleteTestResult
} from "../controllers/TestResultController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all test results for a patient
router.get("/patient/:patientId", auth, getTestResultsByPatientId);

// Get test results by type for a patient
router.get("/patient/:patientId/type/:testType", auth, getTestResultsByType);

// Get a single test result by ID
router.get("/:id", auth, getTestResultById);

// Create a new test result
router.post("/", auth, createTestResult);

// Update a test result
router.put("/:id", auth, updateTestResult);

// Delete a test result
router.delete("/:id", auth, deleteTestResult);

export default router;
