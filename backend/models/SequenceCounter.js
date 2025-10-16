import mongoose from "mongoose";

const sequenceCounterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g., 'invoice'
    dateKey: { type: String, required: true }, // e.g., '20250814'
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

sequenceCounterSchema.index({ name: 1, dateKey: 1 }, { unique: true });

const SequenceCounter = mongoose.model(
  "SequenceCounter",
  sequenceCounterSchema
);
export default SequenceCounter;
