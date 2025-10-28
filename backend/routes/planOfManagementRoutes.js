// routes/planOfManagementRoutes.js
import express from "express";
import {
  createPlanOfManagement,
  getPlanOfManagementByPatientId,
  upsertPlanOfManagementByPatientId,
} from "../controllers/PlanOfManagementController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPlanOfManagement);
router.get("/:patientId", auth, getPlanOfManagementByPatientId);
router.put("/:patientId", auth, upsertPlanOfManagementByPatientId);

export default router;
