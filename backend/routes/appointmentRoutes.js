import express from "express";
import {
  createAppointment,
  getPatientAppointments,
  updateAppointmentStatus,
  updateAppointment,
  getAllAppointments,
  getUpcomingAppointments, // --- NEW ---
} from "../controllers/appointmentController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js"; // It's good practice to protect admin routes

const router = express.Router();

// --- MODIFIED --- Route order is now more specific

// Get all appointments (admin, optionally filtered by date)
router.get("/", [auth, adminAuth], getAllAppointments);

// --- NEW --- Get all UPCOMING appointments (for the dashboard)
router.get("/upcoming", [auth, adminAuth], getUpcomingAppointments);

// Create new appointment for a patient (patient route)
router.post("/", auth, createAppointment);

// Get all appointments for a specific patient
router.get("/:patientId", auth, getPatientAppointments);

// Update a specific appointment's status
router.patch(
  "/:appointmentId/status",
  [auth, adminAuth],
  updateAppointmentStatus
);

// Reschedule a specific appointment
router.patch("/:appointmentId", auth, updateAppointment);

export default router;
