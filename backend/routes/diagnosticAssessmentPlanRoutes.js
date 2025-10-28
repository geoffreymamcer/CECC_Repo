// routes/diagnosticAssessmentPlanRoutes.js
import express from "express";
import {
  createDiagnosticAssessmentPlan,
  getDiagnosticAssessmentPlanByPatientId,
  upsertDiagnosticAssessmentPlanByPatientId,
} from "../controllers/DiagnosticAssessmentPlanController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createDiagnosticAssessmentPlan);
router.get("/:patientId", auth, getDiagnosticAssessmentPlanByPatientId);
router.put("/:patientId", auth, upsertDiagnosticAssessmentPlanByPatientId);

export default router;
