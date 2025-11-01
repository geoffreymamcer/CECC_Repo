// routes/ClinicalExaminationRoutes.js
import express from "express";
import {
  getClinicalExaminationByRecordId,
  updateClinicalExaminationByRecordId,
} from "../controllers/ClinicalExaminationController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/visit/:recordId", auth, getClinicalExaminationByRecordId);

router.put("/visit/:recordId", auth, updateClinicalExaminationByRecordId);

export default router;
