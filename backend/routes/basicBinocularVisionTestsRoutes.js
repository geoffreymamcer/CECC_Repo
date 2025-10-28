import express from "express";
import {
  createBasicBinocularVisionTests,
  getBasicBinocularVisionTestsByPatientId,
  upsertBasicBinocularVisionTestsByPatientId,
} from "../controllers/BasicBinocularVisionTestsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createBasicBinocularVisionTests);
router.get("/:patientId", auth, getBasicBinocularVisionTestsByPatientId);
router.put("/:patientId", auth, upsertBasicBinocularVisionTestsByPatientId);

export default router;
