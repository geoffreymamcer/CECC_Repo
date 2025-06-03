import express from "express";
import {
  getVisitsByPatientId,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit
} from "../controllers/VisitController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all visits for a patient
router.get("/patient/:patientId", auth, getVisitsByPatientId);

// Get a single visit by ID
router.get("/:id", auth, getVisitById);

// Create a new visit
router.post("/", auth, createVisit);

// Update a visit
router.put("/:id", auth, updateVisit);

// Delete a visit
router.delete("/:id", auth, deleteVisit);

export default router;
