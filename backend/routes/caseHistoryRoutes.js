// routes/caseHistoryRoutes.js
import express from "express";
import {
  // --- MODIFIED --- Function names updated to reflect the new logic
  getCaseHistoryByRecordId,
  updateCaseHistoryByRecordId,
} from "../controllers/CaseHistoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// --- MODIFIED --- The parameter is now called 'recordId' for clarity.
router.get("/visit/:recordId", auth, getCaseHistoryByRecordId);
router.put("/visit/:recordId", auth, updateCaseHistoryByRecordId);

export default router;
