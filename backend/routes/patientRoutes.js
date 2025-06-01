import { Router } from "express";
const router = Router();
import {
  createPatient,
  getAllPatients,
} from "../controllers/patientController";
import { auth, requireRole } from "../middleware/auth";

// Explicitly require admin role
router.post("/create", auth, requireRole("admin"), createPatient);
router.get("/", auth, requireRole("admin"), getAllPatients);

export default router;
