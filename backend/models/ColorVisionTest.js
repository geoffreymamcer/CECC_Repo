import mongoose from "mongoose";

const colorVisionTestSchema = new mongoose.Schema(
  {
    patientID: {
      type: String,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    correctPlates: {
      type: Number,
      required: true,
    },
    totalPlates: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    }, // Percentage (0-100)
    testDate: {
      type: Date,
      default: Date.now,
    },
    testResult: {
      type: String,
      required: true,
    },
    clientTestId: {
      type: String,
      sparse: true,
      index: true,
    },
    plateResults: [
      {
        plateNumber: { type: Number, required: true },
        imageSrc: { type: String }, // Store image URL/Path
        question: { type: String },
        userAnswer: { type: String },
        normalVisionAnswer: { type: String },
        protanopiaAnswer: { type: String },
        deuteranopiaAnswer: { type: String },
        totalColorBlindnessAnswer: { type: String },
        evaluation: { type: String }, // "Normal", "Incorrect", etc.
        reasoning: { type: String }, // AI reasoning
        isCorrect: { type: Boolean },
        responseTime: { type: Number }, // in seconds
        inputMethod: { type: String, enum: ["voice", "text", "timeout"] },
        userSnapshot: { type: String },
      },
    ],
    followUpTests: {
      type: Object,
      default: {
        ishihara: false,
        farnsworth: false,
        anomaloscope: false,
        lantern: false,
        colorimetry: false,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("ColorVisionTest", colorVisionTestSchema);
