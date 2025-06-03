import express from "express";
import adminRoutes from "./adminRoutes.js";
import profileRoutes from "./profileRoutes.js";
import userRoutes from "./userRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import colorVisionTestRoutes from "./colorVisionTestRoutes.js";
import medicalHistoryRoutes from "./medicalHistoryRoutes.js";
import visitRoutes from "./visitRoutes.js";
import testResultRoutes from "./testResultRoutes.js";

const router = express.Router();

// Admin routes
router.use("/admin", adminRoutes);

// Profile routes
router.use("/profiles", profileRoutes);

// User routes
router.use("/users", userRoutes);

// Appointment routes
router.use("/appointments", appointmentRoutes);

// Color Vision Test routes
router.use("/colorvisiontest", colorVisionTestRoutes);

// Medical History routes
router.use("/medicalhistory", medicalHistoryRoutes);

// Visit routes
router.use("/visits", visitRoutes);

// Test Result routes
router.use("/testresults", testResultRoutes);

// Test route
router.get("/data", (req, res) => {
  res.json({ message: "Data from backend" });
});

export default router;
