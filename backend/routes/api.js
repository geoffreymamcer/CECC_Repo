import express from "express";
import adminRoutes from "./adminRoutes.js";
import profileRoutes from "./profileRoutes.js";
import userRoutes from "./userRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";

const router = express.Router();

// Admin routes
router.use("/admin", adminRoutes);

// Profile routes
router.use("/profiles", profileRoutes);

// User routes
router.use("/users", userRoutes);

// Appointment routes
router.use("/appointments", appointmentRoutes);

// Test route
router.get("/data", (req, res) => {
  res.json({ message: "Data from backend" });
});

export default router;
