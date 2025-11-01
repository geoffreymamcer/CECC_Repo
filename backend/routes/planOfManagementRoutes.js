// routes/planOfManagementRoutes.js
import express from "express";
import {
  // --- MODIFIED --- Renaming functions to match the new controller logic
  getPlanOfManagementByRecordId,
  updatePlanOfManagementByRecordId,
} from "../controllers/PlanOfManagementController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// --- REMOVED --- The POST route is no longer needed as VisitController handles creation.
// router.post("/", auth, createPlanOfManagement);

// --- MODIFIED --- Route now finds a record by its own unique ID.
router.get("/visit/:recordId", auth, getPlanOfManagementByRecordId);

// --- MODIFIED --- Route now updates a record by its own unique ID.
router.put("/visit/:recordId", auth, updatePlanOfManagementByRecordId);

export default router;
