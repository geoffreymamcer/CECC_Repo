import express from "express";
import {
  getEyeConditionDistribution,
  getVisitGrowth,
  getAgeGroupDistribution,
  getGeographicDistribution,
  getSummaryCardStats,
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

export default router;
