// models/PlanOfManagement.js
import mongoose from "mongoose";

const opticalRxSchema = new mongoose.Schema(
  {
    sphere: { type: String, default: "" },
    cylinder: { type: String, default: "" },
    axis: { type: String, default: "" },
    add: { type: String, default: "" },
    prism: { type: String, default: "" },
    base: { type: String, default: "" },
    mrp: { type: String, default: "" },
    ipd: { type: String, default: "" },
    vh: { type: String, default: "" },
    panto: { type: String, default: "" },
    wrap: { type: String, default: "" },
  },
  { _id: false }
);

const contactLensRxSchema = new mongoose.Schema(
  {
    sphere: { type: String, default: "" },
    cylinder: { type: String, default: "" },
    axis: { type: String, default: "" },
    bc: { type: String, default: "" },
    dia: { type: String, default: "" },
    ozd: { type: String, default: "" },
    sc: { type: String, default: "" },
    pc: { type: String, default: "" },
    ct: { type: String, default: "" },
    material: { type: String, default: "" },
    tint: { type: String, default: "" },
  },
  { _id: false }
);

const planOfManagementSchema = new mongoose.Schema(
  {
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
    slitLampManagement: {
      od: { type: String, default: "" },
      os: { type: String, default: "" },
    },
    opticalManagement: {
      finalRx: {
        od: opticalRxSchema,
        os: opticalRxSchema,
      },
      materials: { type: String, default: "" },
      coating: { type: String, default: "" },
      tint: { type: String, default: "" },
      design: { type: String, default: "" },
      frames: { type: String, default: "" },
      frameMeasurements: {
        a: { type: String, default: "" },
        b: { type: String, default: "" },
        ed: { type: String, default: "" },
        dbl: { type: String, default: "" },
      },
      glazingInstruction: { type: String, default: "" },
    },
    contactLensManagement: {
      finalRx: {
        od: contactLensRxSchema,
        os: contactLensRxSchema,
      },
      design: { type: String, default: "" },
      brand: { type: String, default: "" },
      others: { type: String, default: "" },
    },
    eyeCareSolutions: {
      lubricant: { type: String, default: "" },
      contactLensSolutions: { type: String, default: "" },
      eyeVitamins: { type: String, default: "" },
      lidWipes: { type: String, default: "" },
      warmColdCompress: { type: String, default: "" },
    },
    therapy: {
      amblyopia: { type: String, default: "" },
      patching: {
        patchREye: { type: Boolean, default: false },
        patchLEye: { type: Boolean, default: false },
      },
      time: { type: String, default: "" },
      others: { type: String, default: "" },
    },
    recommendedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
      },
    ],
    ocularHygiene: {
      increaseOutdoorActivities: { type: Boolean, default: false },
      stopDigitalDevices: { type: Boolean, default: false },
      activityCharts: { type: Boolean, default: false },
      visionBreaks: { type: Boolean, default: false },
      sunExposure: { type: Boolean, default: false },
      humidityControl: { type: Boolean, default: false },
      readingDistance: { type: Boolean, default: false },
    },
    referralAndFollowUp: {
      referralTo: { type: String, default: "" },
      purpose: { type: String, default: "" },
      nextAppointment: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const PlanOfManagement = mongoose.model(
  "PlanOfManagement",
  planOfManagementSchema
);
export default PlanOfManagement;
