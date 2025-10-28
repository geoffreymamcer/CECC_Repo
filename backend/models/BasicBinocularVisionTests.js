// models/BasicBinocularVisionTests.js
import mongoose from "mongoose";

const testSchema = (fields) =>
  new mongoose.Schema(
    Object.fromEntries(
      fields.map((field) => [field, { type: String, default: "" }])
    ),
    { _id: false }
  );

const basicBinocularVisionTestsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Profile",
    required: true,
    unique: true,
  },
  binocularTests: {
    stereoAcuityLangs: { type: String, default: "" },
    stereoAcuityCircles: { type: String, default: "" },
    ocularMotilityVersion: { type: String, default: "" },
    npc: { type: String, default: "" },
    w4l6m: { type: String, default: "" },
    w4l33cm: { type: String, default: "" },
    maddoxWing: { type: String, default: "" },
    ct6m: { type: String, default: "" },
    ct33cm: { type: String, default: "" },
    angleEst6m: testSchema(["hirschbergs", "krimsky", "pct"]),
    angleEst33cm: testSchema(["hirschbergs", "krimsky", "pct"]),
    bagolini33cm: { type: String, default: "" },
    bagolini6m: { type: String, default: "" },
    otherTests: { type: String, default: "" },
  },
  monocularTests: {
    npa: {
      od: { type: String, default: "" },
      os: { type: String, default: "" },
    },
    ocularMotilityDuction: {
      od: { type: String, default: "" },
      os: { type: String, default: "" },
    },
  },
});

const BasicBinocularVisionTests = mongoose.model(
  "BasicBinocularVisionTests",
  basicBinocularVisionTestsSchema
);

export default BasicBinocularVisionTests;
