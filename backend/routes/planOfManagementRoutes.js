// routes/planOfManagementRoutes.js
import express from "express";
import {
  createPlanOfManagement,
  getPlanOfManagementByPatientId,
} from "../controllers/PlanOfManagementController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPlanOfManagement);
router.get("/:patientId", auth, getPlanOfManagementByPatientId);

export default router;
