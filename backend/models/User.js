import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "patient"], default: "patient" },
    patientId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String, default: null },
  },
  { timestamps: true }
);

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to generate patient ID
userSchema.pre("save", async function (next) {
  if (this.isNew && this.role === "patient") {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const prefix = `CECC${currentYear}-`;

    // Find the highest existing number for this year
    const highestUser = await this.constructor.findOne(
      { patientId: new RegExp(`^${prefix}`) },
      { patientId: 1 },
      { sort: { patientId: -1 } }
    );

    let nextNumber = 1;
    if (highestUser && highestUser.patientId) {
      const currentNumber = parseInt(highestUser.patientId.split("-")[1]);
      nextNumber = currentNumber + 1;
    }

    // Format the number with leading zeros
    this.patientId = `${prefix}${nextNumber.toString().padStart(4, "0")}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
