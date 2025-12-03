import express from "express";
import {
  createColorVisionTest,
  getAllColorVisionTests,
  getPatientColorVisionTests,
  getColorVisionTest,
  updateFollowUpTests,
  generateTestPDF,
  getAdminPatientColorVisionTests,
} from "../controllers/colorVisionTestController.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin routes
router.get("/admin/all", auth, requireAdmin, getAllColorVisionTests);
router.patch("/:id/followup", auth, requireAdmin, updateFollowUpTests);

// Patient routes
router
  .route("/")
  .post(auth, createColorVisionTest)
  .get(auth, getPatientColorVisionTests);

router.route("/:id").get(auth, getColorVisionTest);
router.get("/:id/pdf", auth, generateTestPDF);
router.get(
  "/admin/patient/:patientId",
  auth,
  requireAdmin,
  getAdminPatientColorVisionTests
);

export default router;
