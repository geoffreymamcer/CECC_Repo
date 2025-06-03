import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Custom ID field
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "patient"], default: "patient" },
    profilePicture: { type: String, default: null },
    patientId: { type: String, default: null }, // Keep for backward compatibility, but not required or unique
  },
  { timestamps: true, _id: false }
);



// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to set patientId for backward compatibility
userSchema.pre("save", async function (next) {
  if (this.isNew && this.role === "admin" && !this._id) {
    // For admin users, use a regular MongoDB ObjectId
    this._id = new mongoose.Types.ObjectId().toString();
  } else if (this.role === "patient" && this._id && !this.patientId) {
    // Set patientId to the same value as _id for backward compatibility
    this.patientId = this._id;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
