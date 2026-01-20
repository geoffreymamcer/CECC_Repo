import express from "express";
import { getAllDiagnoses, createDiagnosis, seedDiagnoses } from "../controllers/DiagnosisController.js";
// import { verifyToken } from "../middleware/authMiddleware.js"; // Optional: if you want to protect these routes

const router = express.Router();

router.get("/", getAllDiagnoses);
router.post("/", createDiagnosis); // Add verifyToken if only admins should add
router.post("/seed", seedDiagnoses); // Useful for initial setup

export default router;
