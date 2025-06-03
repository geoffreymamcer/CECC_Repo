import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      ref: "User",
    },
    result: {
      type: String,
      required: true,
    },
    dateTaken: {
      type: Date,
      default: Date.now,
    },
    conducted: {
      type: String,
      default: "Dr. Philip Richard Budiongan",
    },
    testType: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;