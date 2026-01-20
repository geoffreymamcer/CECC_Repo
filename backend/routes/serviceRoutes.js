import express from "express";
import {
  getServices,
  createService,
} from "../controllers/ServiceController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getServices);
router.post("/", auth, createService);

export default router;
