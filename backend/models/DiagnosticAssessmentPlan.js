// models/DiagnosticAssessmentPlan.js
import mongoose from "mongoose";

const managementDetailSchema = new mongoose.Schema(
  {
    meds: { type: String, default: "" },
    quantity: { type: String, default: "" },
    frequency: { type: String, default: "" },
    duration: { type: String, default: "" },
  },
  { _id: false }
);

const planManagementSchema = new mongoose.Schema(
  {
    od: managementDetailSchema,
    os: managementDetailSchema,
  },
  { _id: false }
);

const diagnosticAssessmentPlanSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Profile",
    required: true,
  },
  visitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true,
  },
  diagnosticTests: {
    aberrometry: { type: Boolean, default: false },
    cornealTopography: { type: Boolean, default: false },
    pachymetry: { type: Boolean, default: false },
    biometry: { type: Boolean, default: false },
    visualField: { type: Boolean, default: false },
    glareAndContrast: { type: Boolean, default: false },
    fundusPhoto: { type: Boolean, default: false },
    anteriorOct: { type: Boolean, default: false },
    posteriorOct: { type: Boolean, default: false },
    nerveFiberAnalyzer: { type: Boolean, default: false },
  },
  interpretationOfResults: {
    type: String,
    default: "",
  },
  assessment: {
    primaryImpression: { type: String, default: "" },
    secondaryImpression: { type: String, default: "" },
  },
  planManagement: [planManagementSchema], // An array to hold the two management blocks
});

const DiagnosticAssessmentPlan = mongoose.model(
  "DiagnosticAssessmentPlan",
  diagnosticAssessmentPlanSchema
);

export default DiagnosticAssessmentPlan;
