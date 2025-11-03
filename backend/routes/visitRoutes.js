import express from "express";
import {
  getMyVisits,
  getVisitsByPatientId,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
  viewMyVisitPDF, // New patient-specific function
  downloadMyVisitPDF, // New patient-specific function
  adminViewVisitPDF,
  adminDownloadVisitPDF,
} from "../controllers/VisitController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// --- PATIENT-FACING ROUTES ---
router.get("/my-visits", auth, getMyVisits);
router.get("/my-visits/:visitId/pdf/view", auth, viewMyVisitPDF);
router.get("/my-visits/:visitId/pdf/download", auth, downloadMyVisitPDF);

// --- ADMIN-FACING ROUTES ---
router.get("/patient/:patientId", [auth, adminAuth], getVisitsByPatientId);
router.get("/admin/:visitId/pdf/view", [auth, adminAuth], adminViewVisitPDF);
router.get(
  "/admin/:visitId/pdf/download",
  [auth, adminAuth],
  adminDownloadVisitPDF
);

// --- GENERAL ROUTES (Used by both, but primarily admin) ---
router.get("/:id", auth, getVisitById);
router.post("/", auth, createVisit);
router.put("/:id", auth, updateVisit);
router.delete("/:id", auth, deleteVisit);

export default router;
