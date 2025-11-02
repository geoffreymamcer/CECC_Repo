import express from "express";
import adminRoutes from "./adminRoutes.js";
import profileRoutes from "./profileRoutes.js";
import userRoutes from "./userRoutes.js";
import patientRoutes from "./patientRoutes.js";
import inventoryRoutes from "./InventoryRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import colorVisionTestRoutes from "./colorVisionTestRoutes.js";
import medicalHistoryRoutes from "./medicalHistoryRoutes.js";
import visitRoutes from "./visitRoutes.js";
import testResultRoutes from "./testResultRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import caseHistoryRoutes from "./caseHistoryRoutes.js";
import clinicalExaminationRoutes from "./ClinicalExaminationRoutes.js";
import basicBinocularVisionTestsRoutes from "./basicBinocularVisionTestsRoutes.js";
import slitLampFunduscopyRoutes from "./slitLampFunduscopyRoutes.js";
import diagnosticAssessmentPlanRoutes from "./diagnosticAssessmentPlanRoutes.js";
import planOfManagementRoutes from "./planOfManagementRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = express.Router();

// Admin routes
router.use("/admin", adminRoutes);

// Inventory routes
router.use("/inventory", inventoryRoutes);

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

// Case History routes
router.use("/casehistory", caseHistoryRoutes);

// Clinical Examination routes
router.use("/clinical-examination", clinicalExaminationRoutes);

//Basic Binocular Vision Tests routes
router.use("/binocular-tests", basicBinocularVisionTestsRoutes);

//slit Lamp and Funduscopy routes
router.use("/slit-lamp-funduscopy", slitLampFunduscopyRoutes);

// Diagnostic Assessment Plan routes
router.use("/diagnostic-assessment-plan", diagnosticAssessmentPlanRoutes);

router.use("/plan-of-management", planOfManagementRoutes);
router.use("/analytics", analyticsRoutes);

// Plan of Management routes
// Visit routes
router.use("/visits", visitRoutes);

// Test Result routes
router.use("/testresults", testResultRoutes);

// Invoice routes
router.use("/invoices", invoiceRoutes);

// Test route
router.get("/data", (req, res) => {
  res.json({ message: "Data from backend" });
});

export default router;
