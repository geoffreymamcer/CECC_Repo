import express from "express";
import {
  getInvoicesByPatientId,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getNextInvoiceNumbers,
  downloadInvoicePDF,
  getPatientInvoices,
  getInvoicePDF,
  getRecentInvoices,
  getTodaysRevenue,
} from "../controllers/InvoiceController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get total revenue for today
router.get("/revenue/today", auth, getTodaysRevenue);

// Get invoices for the logged-in patient
router.get("/patient", auth, getPatientInvoices);

// Get PDF for specific invoice
router.get("/:id/pdf/view", auth, getInvoicePDF);
router.get("/:id/pdf/download", auth, getInvoicePDF);

// Get all invoices for a patient (admin route)
router.get("/patient/:patientId", auth, getInvoicesByPatientId);

router.get("/recent", auth, getRecentInvoices);

// Preview next numbers for a given date (no increment) - must be before ":id"
router.get("/preview/next", auth, getNextInvoiceNumbers);

// Get a single invoice by ID
router.get("/:id", auth, getInvoiceById);

// Create a new invoice
router.post("/", auth, createInvoice);

// Update an invoice
router.put("/:id", auth, updateInvoice);

// Delete an invoice
router.delete("/:id", auth, deleteInvoice);

// Download invoice PDF
router.get("/:id/pdf", auth, downloadInvoicePDF);

export default router;
