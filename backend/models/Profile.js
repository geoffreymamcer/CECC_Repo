import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      ref: "User",
    },
    patientId: {
      type: String,
      default: function () {
        return this._id;
      }, // Default to _id for backward compatibility
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
    // Address will be stored as a plain display string. For backward compatibility
    // older documents may have used an object. We also store a separate
    // `addressCombined` field that holds the compact form: "Barangay, City, Province, Region".
    // This avoids sending objects for the address field.
    address: { type: String, default: "" },
    region: { type: String, default: "" },
    province: { type: String, default: "" },
    city: { type: String, default: "" },
    barangay: { type: String, default: "" },
    street_subdivision: { type: String, default: "" },
    addressCombined: { type: String, default: "" },
    contact: { type: String },
    occupation: { type: String },
    civilStatus: { type: String },
    referralBy: { type: String },
    ageCategory: { type: String },
    // Medical History reference
    medicalHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalHistory",
    },
    // Visit History reference - this will be an array of visit IDs
    visits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visit",
      },
    ],
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
