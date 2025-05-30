const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    occupation: { type: String, required: true },
    civilStatus: String,
    referralBy: String,
    ageCategory: String,

    // Medical History
    ocularHistory: String,
    healthHistory: String,
    familyMedicalHistory: String,
    medications: String,
    allergies: String,
    occupationalHistory: String,
    digitalHistory: String,

    // Visit-Specific Details
    chiefComplaint: { type: String, required: true },
    associatedComplaint: String,
    diagnosis: { type: String, required: true },
    treatmentPlan: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
