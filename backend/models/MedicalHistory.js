import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      ref: "User"
    },
    ocularHistory: { 
      type: String,
      default: ""
    },
    healthHistory: { 
      type: String,
      default: ""
    },
    familyMedicalHistory: { 
      type: String,
      default: ""
    },
    medications: { 
      type: String,
      default: ""
    },
    allergies: { 
      type: String,
      default: ""
    },
    occupationalHistory: { 
      type: String,
      default: ""
    },
    digitalHistory: { 
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Create a compound index to ensure each patient has only one medical history record
medicalHistorySchema.index({ patientId: 1 }, { unique: true });

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);
export default MedicalHistory;