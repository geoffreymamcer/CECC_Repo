import express from "express";
import {
  getPlanOfManagementByRecordId,
  updatePlanOfManagementByRecordId,
  getLatestPlanForPatient,
} from "../controllers/PlanOfManagementController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
router.get("/my-latest", auth, getLatestPlanForPatient);

router.get("/visit/:recordId", auth, getPlanOfManagementByRecordId);
router.put("/visit/:recordId", auth, updatePlanOfManagementByRecordId);

export default router;
