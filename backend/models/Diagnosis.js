import mongoose from "mongoose";

const DiagnosisSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Diagnosis = mongoose.model("Diagnosis", DiagnosisSchema);
export default Diagnosis;
