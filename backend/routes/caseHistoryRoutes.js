// routes/caseHistoryRoutes.js
import express from "express";
import {
  createCaseHistory,
  getCaseHistoryByPatientId,
} from "../controllers/CaseHistoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createCaseHistory);
router.get("/:patientId", auth, getCaseHistoryByPatientId);

export default router;
