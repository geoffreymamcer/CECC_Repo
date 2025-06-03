import mongoose from "mongoose";

const colorVisionTestSchema = new mongoose.Schema(
  {
    patientID: { 
      type: String, 
      ref: "User", 
      required: true 
    },
    correctPlates: { 
      type: Number, 
      required: true 
    },
    totalPlates: { 
      type: Number, 
      required: true 
    },
    accuracy: { 
      type: Number, 
      required: true 
    }, // Percentage (0-100)
    testDate: { 
      type: Date, 
      default: Date.now 
    },
    testResult: { 
      type: String, 
      required: true 
    }, // Pass/Fail or specific diagnosis
    clientTestId: {
      type: String,
      sparse: true,
      index: true
    } // Client-side generated ID to prevent duplicates
  },
  { timestamps: true }
);

export default mongoose.model("ColorVisionTest", colorVisionTestSchema);
