// models/Visit.js
import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      ref: "User",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    doctor: {
      type: String,
      default: "Dr. Philip Richard Budiongan",
    },
    caseHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseHistory",
    },
    clinicalExamination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalExamination",
    },
    basicBinocularVisionTests: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BasicBinocularVisionTests",
    },
    slitLampFunduscopy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SlitLampFunduscopy",
    },
    diagnosticAssessmentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiagnosticAssessmentPlan",
    },
    planOfManagement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanOfManagement",
    },

    notes: {
      type: String,
      default: "no notes yet",
    },
    prescriptions: {
      type: String,
      default: "no prescriptions yet",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
