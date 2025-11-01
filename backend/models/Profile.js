// models/Profile.js
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
      },
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
