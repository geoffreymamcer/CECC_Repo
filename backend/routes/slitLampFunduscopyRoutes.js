// routes/slitLampFunduscopyRoutes.js
import express from "express";
import {
  createSlitLampFunduscopy,
  getSlitLampFunduscopyByPatientId,
} from "../controllers/SlitLampFunduscopyController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Route to create a new record
router.post("/", auth, createSlitLampFunduscopy);

// Route to get a record by patientId
router.get("/:patientId", auth, getSlitLampFunduscopyByPatientId);

export default router;
