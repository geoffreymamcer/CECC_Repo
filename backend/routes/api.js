import express from "express";
import adminRoutes from "./adminRoutes.js";
import profileRoutes from "./profileRoutes.js";

const router = express.Router();

// Admin routes
router.use("/admin", adminRoutes);

// Profile routes
router.use("/profiles", profileRoutes);

// Test route
router.get("/data", (req, res) => {
  res.json({ message: "Data from backend" });
});

export default router;
