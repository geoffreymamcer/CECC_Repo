import express from "express";
import {
  createBasicBinocularVisionTests,
  getBasicBinocularVisionTestsByPatientId,
} from "../controllers/BasicBinocularVisionTestsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createBasicBinocularVisionTests);
router.get("/:patientId", auth, getBasicBinocularVisionTestsByPatientId);

export default router;
