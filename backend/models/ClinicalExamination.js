import mongoose from "mongoose";

const eyeDataSchema = new mongoose.Schema(
  {
    sc: { type: String, default: "" },
    ph: { type: String, default: "" },
    near: { type: String, default: "" },
  },
  { _id: false }
);

const refractionSchema = new mongoose.Schema(
  {
    sphere: { type: String, default: "" },
    cylinder: { type: String, default: "" },
    axis: { type: String, default: "" },
  },
  { _id: false }
);

const manifestRefractionSchema = new mongoose.Schema(
  {
    sphere: { type: String, default: "" },
    cylinder: { type: String, default: "" },
    axis: { type: String, default: "" },
    va: { type: String, default: "" },
    add: { type: String, default: "" },
    nva: { type: String, default: "" },
  },
  { _id: false }
);

const autokeratometerSchema = new mongoose.Schema(
  {
    k1: { type: String, default: "" },
    k2: { type: String, default: "" },
    axis: { type: String, default: "" },
  },
  { _id: false }
);

const pupilSizeSchema = new mongoose.Schema(
  {
    mpd: { type: String, default: "" },
    pupilSize: { type: String, default: "" },
    hvid: { type: String, default: "" },
  },
  { _id: false }
);

const pupilExaminationSchema = new mongoose.Schema(
  {
    rapd: { type: String, default: "" },
    direct: { type: String, default: "" },
    consensual: { type: String, default: "" },
    perrla: { type: String, default: "" },
  },
  { _id: false }
);

// --- START OF FIX ---
const dominantEyeDetailSchema = new mongoose.Schema(
  {
    od: { type: String, default: "" },
    os: { type: String, default: "" },
  },
  { _id: false }
);
// --- END OF FIX ---

const clinicalExaminationSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Profile",
    required: true,
    unique: true,
  },
  visualAcuity: {
    chartUsed: { type: String, default: "" },
    testDistanceUsed: { type: String, default: "" },
    testDistanceOther: { type: String, default: "" },
    withoutGlasses: {
      od: eyeDataSchema,
      os: eyeDataSchema,
    },
    withGlasses: {
      od: eyeDataSchema,
      os: eyeDataSchema,
    },
    // --- START OF FIX ---
    dominantEye: {
      far: dominantEyeDetailSchema,
      near: dominantEyeDetailSchema,
    },
    // --- END OF FIX ---
  },
  autorefractometer: {
    od: refractionSchema,
    os: refractionSchema,
  },
  autokeratometer: {
    od: autokeratometerSchema,
    os: autokeratometerSchema,
  },
  pdPupilSize: {
    od: pupilSizeSchema,
    os: pupilSizeSchema,
  },
  pupilExamination: {
    od: pupilExaminationSchema,
    os: pupilExaminationSchema,
  },
  manifestRefraction: {
    od: manifestRefractionSchema,
    os: manifestRefractionSchema,
  },
  cycloplegicAR: {
    od: refractionSchema,
    os: refractionSchema,
  },
  cycloplegicSubjRefraction: {
    od: refractionSchema,
    os: refractionSchema,
  },
  arkResults: {
    type: String,
    default: "",
  },
  // --- START OF FIX ---
  medsUsed: {
    type: { type: String, default: "" },
    comboTCOthers: { type: String, default: "" },
  },
  // --- END OF FIX ---
});

const ClinicalExamination = mongoose.model(
  "ClinicalExamination",
  clinicalExaminationSchema
);

export default ClinicalExamination;
