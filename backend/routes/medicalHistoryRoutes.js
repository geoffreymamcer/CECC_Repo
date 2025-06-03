import express from "express";
import {
  getMedicalHistoryByPatientId,
  createMedicalHistory,
  updateMedicalHistory,
  updateMedicalHistoryByPatientId,
  deleteMedicalHistory
} from "../controllers/MedicalHistoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get medical history by patient ID
router.get("/:patientId", auth, getMedicalHistoryByPatientId);

// Create new medical history
router.post("/", auth, createMedicalHistory);

// Update medical history by ID
router.put("/:id", auth, updateMedicalHistory);

// Update or create medical history by patient ID
router.put("/patient/:patientId", auth, updateMedicalHistoryByPatientId);

// Delete medical history
router.delete("/:id", auth, deleteMedicalHistory);

export default router;
