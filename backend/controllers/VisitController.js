import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";
import CaseHistory from "../models/CaseHistory.js";
import ClinicalExamination from "../models/ClinicalExamination.js";
import BasicBinocularVisionTests from "../models/BasicBinocularVisionTests.js";
import SlitLampFunduscopy from "../models/SlitLampFunduscopy.js";
import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import PlanOfManagement from "../models/PlanOfManagement.js";
import { generateVisitReport } from "../services/pdfGenerator.js";
import Notification from "../models/Notification.js";

export const getMyVisits = async (req, res) => {
  try {
    // The 'auth' middleware provides req.user.id, which is the patientId
    const patientId = req.user.id;
    const visits = await Visit.find({ patientId }).sort({ visitDate: -1 });
    res.status(200).json(visits);
  } catch (error) {
    console.error("Error fetching user's visits:", error);
    res.status(500).json({ message: "Failed to fetch visit history." });
  }
};

// Get all visits for a patient
export const getVisitsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const visits = await Visit.find({ patientId }).sort({ visitDate: -1 });

    res.status(200).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching visits",
    });
  }
};

// Get a single visit by ID
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    res.status(200).json(visit);
  } catch (error) {
    console.error("Error fetching visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching visit",
    });
  }
};

// Create a new visit
export const createVisit = async (req, res) => {
  try {
    const { patientId } = req.body;

    // 1. Create the base visit document first.
    const newVisit = new Visit({
      patientId,
      visitDate: req.body.visitDate || new Date(),
      doctor: req.body.doctor,
    });

    // 2. Create a new, empty document for each clinical record, linking them to the new visit.
    const newCaseHistory = await CaseHistory.create({
      patientId,
      visitId: newVisit._id,
    });
    const newClinicalExam = await ClinicalExamination.create({
      patientId,
      visitId: newVisit._id,
    });
    const newBinoTests = await BasicBinocularVisionTests.create({
      patientId,
      visitId: newVisit._id,
    });
    const newSlitLamp = await SlitLampFunduscopy.create({
      patientId,
      visitId: newVisit._id,
    });
    const newDiagnosticPlan = await DiagnosticAssessmentPlan.create({
      patientId,
      visitId: newVisit._id,
    });
    const newPlanOfManagement = await PlanOfManagement.create({
      patientId,
      visitId: newVisit._id,
    });

    // 3. Add the IDs of the newly created records to the visit document.
    newVisit.caseHistory = newCaseHistory._id;
    newVisit.clinicalExamination = newClinicalExam._id;
    newVisit.basicBinocularVisionTests = newBinoTests._id;
    newVisit.slitLampFunduscopy = newSlitLamp._id;
    newVisit.diagnosticAssessmentPlan = newDiagnosticPlan._id;
    newVisit.planOfManagement = newPlanOfManagement._id;

    // 4. Save the fully populated visit.
    await newVisit.save();

    // 5. Add this new visit's ID to the patient's profile.
    await Profile.findByIdAndUpdate(patientId, {
      $push: { visits: newVisit._id },
    });
    const notificationPayload = {
      recipient: patientId,
      title: "New Visit Record Added",
      message: `A new clinical record for your visit on ${new Date(
        newVisit.visitDate
      ).toLocaleDateString()} is available.`,
      type: "test_result", // Use 'test_result' to match your other clinical notifications
      link: "/user-dashboard?tab=test-results", // Directs user to the right tab
    };

    // Save the notification to the database for persistence
    await Notification.create(notificationPayload);

    // Emit the real-time event to the patient if they are currently online
    const recipientSocketId = req.onlineUsers.get(patientId);
    if (recipientSocketId) {
      req.io
        .to(recipientSocketId)
        .emit("new_notification", notificationPayload);
      console.log(`Sent new visit notification to patient ${patientId}`);
    }
    //

    res.status(201).json(newVisit);
  } catch (error) {
    console.error("Error creating visit and associated records:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating visit",
    });
  }
};

// Update a visit
export const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const visit = await Visit.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    res.status(200).json(visit);
  } catch (error) {
    console.error("Error updating visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating visit",
    });
  }
};

// Delete a visit
export const deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    // Remove the visit from the profile's visits array
    await Profile.findOneAndUpdate(
      { patientId: visit.patientId },
      { $pull: { visits: id } }
    );

    // Delete the visit
    await Visit.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Visit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error deleting visit",
    });
  }
};

export const downloadVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    const visit = await Visit.findById(visitId)
      .populate("caseHistory")
      .populate("clinicalExamination")
      .populate("basicBinocularVisionTests")
      .populate("slitLampFunduscopy")
      .populate("diagnosticAssessmentPlan")
      .populate("planOfManagement")
      .lean();

    if (!visit)
      return res.status(404).json({ message: "Visit report not found" });
    if (visit.patientId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const patient = await Profile.findById(visit.patientId).lean();
    if (!patient)
      return res
        .status(404)
        .json({ message: "Associated patient profile not found" });

    const pdfBuffer = await generateVisitReport(visit, patient);

    res.setHeader("Content-Type", "application/pdf");
    // This header tells the browser to force a download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="visit-report-${patient.patientId}-${
        new Date(visit.visitDate).toISOString().split("T")[0]
      }.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF for download:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};

export const viewVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    const visit = await Visit.findById(visitId)
      .populate(/* ... all your populates ... */)
      .lean();

    if (!visit)
      return res.status(404).json({ message: "Visit report not found" });
    if (visit.patientId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const patient = await Profile.findById(visit.patientId).lean();
    if (!patient)
      return res
        .status(404)
        .json({ message: "Associated patient profile not found" });

    const pdfBuffer = await generateVisitReport(visit, patient);

    res.setHeader("Content-Type", "application/pdf");
    // This header tells the browser to try to display it "inline" in a new tab
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF for viewing:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};

export const adminDownloadVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    // --- THIS IS THE FIX ---
    // Add the full .populate() chain to fetch all related clinical data.
    const visit = await Visit.findById(visitId)
      .populate("caseHistory")
      .populate("clinicalExamination")
      .populate("basicBinocularVisionTests")
      .populate("slitLampFunduscopy")
      .populate("diagnosticAssessmentPlan")
      .populate("planOfManagement")
      .lean();

    if (!visit)
      return res.status(404).json({ message: "Visit report not found" });

    const patient = await Profile.findById(visit.patientId).lean();
    if (!patient)
      return res
        .status(404)
        .json({ message: "Associated patient profile not found" });

    const pdfBuffer = await generateVisitReport(visit, patient);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="visit-report-${patient.patientId}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in adminDownloadVisitPDF:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};

export const adminViewVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    // --- THIS IS THE FIX ---
    // Add the full .populate() chain here as well.
    const visit = await Visit.findById(visitId)
      .populate("caseHistory")
      .populate("clinicalExamination")
      .populate("basicBinocularVisionTests")
      .populate("slitLampFunduscopy")
      .populate("diagnosticAssessmentPlan")
      .populate("planOfManagement")
      .lean();

    if (!visit)
      return res.status(404).json({ message: "Visit report not found" });

    const patient = await Profile.findById(visit.patientId).lean();
    if (!patient)
      return res
        .status(404)
        .json({ message: "Associated patient profile not found" });

    const pdfBuffer = await generateVisitReport(visit, patient);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in adminViewVisitPDF:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};

export const viewMyVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    const patientId = req.user.id; // Get ID from the logged-in user's token

    const visit = await Visit.findById(visitId)
      .populate(
        "caseHistory clinicalExamination basicBinocularVisionTests slitLampFunduscopy diagnosticAssessmentPlan planOfManagement"
      )
      .lean();
    if (!visit) {
      return res.status(404).json({ message: "Visit report not found." });
    }

    // Security Check: Does this visit belong to the logged-in user?
    if (visit.patientId !== patientId) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to view this report.",
      });
    }

    const patient = await Profile.findById(patientId).lean();
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Associated patient profile not found." });
    }

    // Use a helper or directly call the PDF generation
    const pdfBuffer = await generateVisitReport(visit, patient);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in viewMyVisitPDF:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};

// PATIENT-facing function to DOWNLOAD a PDF
export const downloadMyVisitPDF = async (req, res) => {
  try {
    const { visitId } = req.params;
    const patientId = req.user.id;

    const visit = await Visit.findById(visitId)
      .populate(
        "caseHistory clinicalExamination basicBinocularVisionTests slitLampFunduscopy diagnosticAssessmentPlan planOfManagement"
      )
      .lean();
    if (!visit) {
      return res.status(404).json({ message: "Visit report not found." });
    }

    // Security Check: Does this visit belong to the logged-in user?
    if (visit.patientId !== patientId) {
      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to download this report.",
      });
    }

    const patient = await Profile.findById(patientId).lean();
    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found." });
    }

    const pdfBuffer = await generateVisitReport(visit, patient);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="clinic-report-${
        visit.visitDate.toISOString().split("T")[0]
      }.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error in downloadMyVisitPDF:", error);
    res.status(500).json({ message: "Failed to generate PDF report." });
  }
};
