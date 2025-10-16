import { Router } from "express";
const router = Router();
import {
  createPatient,
  getAllPatients,
} from "../controllers/patientController.js";
import { auth, requireRole } from "../middleware/auth.js";

// Explicitly require admin role
router.post("/create", auth, requireRole("admin"), createPatient);
router.get("/", auth, requireRole("admin"), getAllPatients);

export default router;
