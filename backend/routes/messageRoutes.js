import express from "express";
import {
  createSupportMessage,
  getRecentMessages,
  sendReplyToPatient,
  getConversationMessages,
  getMyConversations,
  markMessageAsRead,
  sendPatientReply,
} from "../controllers/messageController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Patient sends the first message
router.post("/support", auth, createSupportMessage);
router.get("/my-conversations", auth, getMyConversations); // <--- (A) This route is defined
router.patch("/:messageId/read", auth, markMessageAsRead);
router.post("/patient-reply/:conversationId", auth, sendPatientReply); // 👈 ADD THIS ROUTE

// Admin gets the list of recent messages for the dashboard
router.get("/recent", auth, getRecentMessages); // Should be adminOnly

// Admin sends a reply to a patient
router.post("/reply/:conversationId", auth, sendReplyToPatient); // Should be adminOnly

router.get("/conversation/:conversationId", auth, getConversationMessages);
export default router;
