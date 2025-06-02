import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String },
    phone_number: { type: String },
    profilePicture: { type: String, default: null },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String },
    address: { type: String },
    contact: { type: String },
    occupation: { type: String },
    civilStatus: { type: String },
    referralBy: { type: String },
    ageCategory: { type: String },
    // Medical History
    ocularHistory: { type: String },
    healthHistory: { type: String },
    familyMedicalHistory: { type: String },
    medications: { type: String },
    allergies: { type: String },
    occupationalHistory: { type: String },
    digitalHistory: { type: String },
    // Visit Details
    chiefComplaint: { type: String },
    associatedComplaint: { type: String },
    diagnosis: { type: String },
    treatmentPlan: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
