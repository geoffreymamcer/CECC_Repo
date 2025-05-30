import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    purpose_of_visit: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    is_first_time: { type: Boolean, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    attended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
