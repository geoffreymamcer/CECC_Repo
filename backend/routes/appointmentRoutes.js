import express from "express";
import {
  createAppointment,
  getPatientAppointments,
  updateAppointmentStatus,
  updateAppointment
} from "../controllers/appointmentController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Admin: Get all appointments (optionally filtered by date)
import { getAllAppointments } from "../controllers/appointmentController.js";
router.get("/", getAllAppointments);

// Create new appointment for a patient (must be logged in)
router.post("/", auth, createAppointment);

// Get all appointments for a patient (must be logged in)
router.get("/:patientId", auth, getPatientAppointments);

// Update appointment status
router.patch("/:appointmentId/status", updateAppointmentStatus);

router.patch("/:appointmentId", auth, updateAppointment);


export default router;
