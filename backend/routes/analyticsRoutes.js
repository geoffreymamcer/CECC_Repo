import express from "express";
import {
  getEyeConditionDistribution,
  getVisitGrowth,
  getAgeGroupDistribution,
  getGeographicDistribution,
  getSummaryCardStats,
  getClinicalCorrelation,
  getPeakHours,
  getServiceDistribution,
} from "../controllers/AnalyticsController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// This route is protected and can only be accessed by admin/owner
router.get("/eye-conditions", [auth, adminAuth], getEyeConditionDistribution);
router.get("/visit-growth", [auth, adminAuth], getVisitGrowth);
router.get(
  "/age-group-distribution",
  [auth, adminAuth],
  getAgeGroupDistribution
);
router.get(
  "/geographic-distribution",
  [auth, adminAuth],
  getGeographicDistribution
);
router.get("/summary-cards", [auth, adminAuth], getSummaryCardStats);

// Deep Analytics Routes
router.get("/clinical-correlation", [auth, adminAuth], getClinicalCorrelation);
router.get("/peak-hours", [auth, adminAuth], getPeakHours);
router.get("/service-distribution", [auth, adminAuth], getServiceDistribution);

export default router;
