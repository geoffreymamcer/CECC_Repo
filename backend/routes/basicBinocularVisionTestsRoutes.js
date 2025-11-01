// routes/basicBinocularVisionTestsRoutes.js
import express from "express";
import {
  getBinocularTestsByRecordId,
  updateBinocularTestsByRecordId,
} from "../controllers/BasicBinocularVisionTestsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/visit/:recordId", auth, getBinocularTestsByRecordId);
router.put("/visit/:recordId", auth, updateBinocularTestsByRecordId);

export default router;
