import express from "express";
import { loginAdmin, verifyToken } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/verify", adminAuth, verifyToken);

export default router;
