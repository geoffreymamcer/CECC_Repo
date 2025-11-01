// routes/diagnosticAssessmentPlanRoutes.js
import express from "express";
import {
  // --- MODIFIED --- Renaming functions for clarity and new logic
  getDiagnosticPlanByRecordId,
  updateDiagnosticPlanByRecordId,
} from "../controllers/DiagnosticAssessmentPlanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// --- REMOVED --- The POST route is no longer needed here.
// router.post("/", auth, createDiagnosticAssessmentPlan);

// --- MODIFIED --- Route now finds a record by its own unique ID.
router.get("/visit/:recordId", auth, getDiagnosticPlanByRecordId);

// --- MODIFIED --- Route now updates a record by its own unique ID.
router.put("/visit/:recordId", auth, updateDiagnosticPlanByRecordId);

export default router;
