import express from "express";
const router = express.Router();
import {
  registerPatient,
  loginPatient,
} from "../controllers/patientAuthController.js";

router.post("/register", registerPatient);
router.post("/login", loginPatient);

export default router;
