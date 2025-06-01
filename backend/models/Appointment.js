import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      ref: "Profile",
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
