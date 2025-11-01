// routes/slitLampFunduscopyRoutes.js
import express from "express";
import {
  // --- MODIFIED --- Renaming functions for clarity
  getSlitLampFunduscopyByRecordId,
  updateSlitLampFunduscopyByRecordId,
} from "../controllers/SlitLampFunduscopyController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// --- REMOVED --- The POST route is no longer needed here.
// router.post("/", auth, createSlitLampFunduscopy);

// --- MODIFIED --- Route now finds a record by its own unique ID.
router.get("/visit/:recordId", auth, getSlitLampFunduscopyByRecordId);

// --- MODIFIED --- Route now updates a record by its own unique ID.
router.put("/visit/:recordId", auth, updateSlitLampFunduscopyByRecordId);

export default router;
