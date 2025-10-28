// routes/clinicalExaminationRoutes.js
import express from "express";
import {
  createClinicalExamination,
  getClinicalExaminationByPatientId,
  upsertClinicalExaminationByPatientId,
} from "../controllers/ClinicalExaminationController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createClinicalExamination);
router.get("/:patientId", auth, getClinicalExaminationByPatientId);
router.put("/:patientId", auth, upsertClinicalExaminationByPatientId);

export default router;
