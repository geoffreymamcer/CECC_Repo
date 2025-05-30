import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verificationCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Document expires in 1 hour
});

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);
export default PendingRegistration;
