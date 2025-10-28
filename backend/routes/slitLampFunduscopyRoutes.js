// routes/slitLampFunduscopyRoutes.js
import express from "express";
import {
  createSlitLampFunduscopy,
  getSlitLampFunduscopyByPatientId,
  upsertSlitLampFunduscopyByPatientId,
} from "../controllers/SlitLampFunduscopyController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createSlitLampFunduscopy);
router.get("/:patientId", auth, getSlitLampFunduscopyByPatientId);
router.put("/:patientId", auth, upsertSlitLampFunduscopyByPatientId);

export default router;
