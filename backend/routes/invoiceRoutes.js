import express from "express";
import {
  createInvoice,
  getInvoicesByPatientId,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getPatientInvoices,
  getRecentInvoices,
  getTodaysRevenue,
  getNextInvoiceNumbers,
  downloadInvoicePDF, // Our new on-demand generator
  viewInvoicePDF, // Our new on-demand generator
  getItemSalesDistribution,
  getSalesOverTime,
  getSalesByAgeGroup,
  getSalesBreakdown,
  getSummaryCardStats,
} from "../controllers/InvoiceController.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js"; // Assuming you have this

const router = express.Router();

// This route should be protected to only allow owner/admin access
router.get(
  "/analytics/item-distribution",
  [auth, adminAuth],
  getItemSalesDistribution
);
router.get("/analytics/sales-over-time", [auth, adminAuth], getSalesOverTime);
router.get("/analytics/by-age-group", [auth, adminAuth], getSalesByAgeGroup);
router.get("/analytics/sales-breakdown", [auth, adminAuth], getSalesBreakdown);
router.get("/analytics/summary-cards", [auth, adminAuth], getSummaryCardStats);

// --- Static routes first ---
router.get("/revenue/today", auth, getTodaysRevenue);
router.get("/patient", auth, getPatientInvoices); // For logged-in patient
router.get("/recent", auth, getRecentInvoices);
router.get("/preview/next", auth, getNextInvoiceNumbers);

// --- Dynamic routes with IDs last ---
router.get("/patient/:patientId", auth, getInvoicesByPatientId); // For admin to get any patient's invoices
router.get("/:id/pdf/view", auth, viewInvoicePDF);
router.get("/:id/pdf/download", auth, downloadInvoicePDF);
router.get("/:id", auth, getInvoiceById);
router.put("/:id", auth, updateInvoice);
router.delete("/:id", auth, deleteInvoice);

// --- POST route ---
router.post("/", auth, createInvoice);

export default router;
