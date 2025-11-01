import express from "express";
import {
  getVisitsByPatientId,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
  downloadVisitPDF,
  viewVisitPDF,
  getMyVisits,
  adminDownloadVisitPDF, // --- NEW ---
  adminViewVisitPDF,
} from "../controllers/VisitController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// --- NEW --- Secure route for a logged-in patient to get their own visits
router.get("/my-visits", auth, getMyVisits);

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

//route for downloading the PDF
router.get("/:visitId/pdf", auth, downloadVisitPDF);

// Route for viewing the PDF
router.get("/:visitId/pdf/view", auth, viewVisitPDF);

router.get(
  "/admin/:visitId/pdf/download",
  [auth, adminAuth],
  adminDownloadVisitPDF
);
router.get("/admin/:visitId/pdf/view", [auth, adminAuth], adminViewVisitPDF);

export default router;
