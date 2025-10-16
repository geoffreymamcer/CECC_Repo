import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      ref: "User",
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    associatedComplaint: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatmentPlan: {
      type: String,
      default: "",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    doctor: {
      type: String,
      default: "Dr. Philip Richard Budiongan",
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
