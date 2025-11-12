import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      // The patientId of the user who should receive it
      type: String,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      // e.g., 'invoice', 'test_result'
      type: String,
      required: true,
    },
    link: {
      // A URL to navigate to when clicked (e.g., /records?tab=receipts)
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
