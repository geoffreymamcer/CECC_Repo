import { Router } from "express";
const router = Router();
import { loginPatient } from "../controllers/patientLogInController";

router.post("/login", loginPatient);

export default router;
