// routes/diagnosticAssessmentPlanRoutes.js
import express from "express";
import {
  createDiagnosticAssessmentPlan,
  getDiagnosticAssessmentPlanByPatientId,
} from "../controllers/DiagnosticAssessmentPlanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/diagnostic-assessment-plan
// @desc    Create a diagnostic assessment plan
// @access  Private
router.post("/", auth, createDiagnosticAssessmentPlan);

// @route   GET api/diagnostic-assessment-plan/:patientId
// @desc    Get a diagnostic assessment plan by patient ID
// @access  Private
router.get("/:patientId", auth, getDiagnosticAssessmentPlanByPatientId);

export default router;
