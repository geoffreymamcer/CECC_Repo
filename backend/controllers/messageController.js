import Message from "../models/Message.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

export const createSupportMessage = async (req, res) => {
  try {
    const { subject, content } = req.body;
    const senderId = req.user.id; // Patient's ID from 'auth' middleware

    // 1. Create a new conversation with the patient as a participant
    const newConversation = new Conversation({
      participants: [senderId], // Initially, only the patient is a participant
      subject: subject,
    });
    await newConversation.save();

    // 2. Create the first message linked to this new conversation
    const newMessage = new Message({
      conversation: newConversation._id,
      sender: senderId,
      content: content,
    });
    await newMessage.save();

    // 3. Update the conversation with the ID of this first message
    newConversation.lastMessage = newMessage._id;
    await newConversation.save();

    // --- Real-time notification logic remains the same ---
    const populatedMessage = await newMessage.populate({
      path: "conversation",
      populate: {
        path: "participants",
        select: "firstName lastName patientId",
      },
    });

    const adminRecipients = await User.find({
      role: { $in: ["admin", "owner"] },
    }).select("_id");

    for (const admin of adminRecipients) {
      const recipientSocketId = req.onlineUsers.get(admin._id.toString());
      if (recipientSocketId) {
        req.io
          .to(recipientSocketId)
          .emit("new_support_message", populatedMessage);
        console.log(`Sent new support message to admin ${admin._id}`);
      }
    }

    res.status(201).json({
      status: "success",
      message: "Your message has been sent.",
    });
  } catch (error) {
    console.error("Error creating support message:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while sending your message.",
    });
  }
};

export const sendReplyToPatient = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, patientId } = req.body;
    const senderId = req.user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res
        .status(404)
        .json({ status: "error", message: "Conversation not found." });
    }

    const newReply = new Message({
      conversation: conversationId,
      sender: senderId,
      content: content,
    });
    await newReply.save();

    conversation.lastMessage = newReply._id;
    if (!conversation.participants.includes(senderId)) {
      conversation.participants.push(senderId);
    }
    await conversation.save();

    // --- START OF FIX ---

    // After saving, populate the sender field for BOTH the HTTP response and the socket event.
    const populatedReply = await Message.findById(newReply._id).populate(
      "sender",
      "firstName lastName role"
    );

    // --- END OF FIX ---

    const recipientSocketId = req.onlineUsers.get(patientId);
    if (recipientSocketId) {
      // Use the already populated object for the socket event
      req.io.to(recipientSocketId).emit("new_message_reply", populatedReply);
      console.log(`Sent new reply to patient ${patientId}`);
    }

    // Send the FULLY POPULATED reply back to the admin who sent it.
    res.status(201).json({ status: "success", data: populatedReply });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while sending the reply.",
    });
  }
};

export const getRecentMessages = async (req, res) => {
  try {
    // --- START OF FIX ---
    // We use an aggregation pipeline to filter messages by the sender's role.
    const messages = await Message.aggregate([
      // Stage 1: Sort all messages by creation date to get the most recent ones first.
      { $sort: { createdAt: -1 } },

      // Stage 2: Perform a "lookup" (a JOIN) to the 'users' collection.
      {
        $lookup: {
          from: "users", // The collection to join with
          localField: "sender", // The field from the Message collection
          foreignField: "_id", // The field from the User collection
          as: "senderInfo", // The name of the new array field to add
        },
      },

      // Stage 3: Unwind the senderInfo array to deconstruct it into an object.
      { $unwind: "$senderInfo" },

      // Stage 4: Match only those documents where the sender's role is 'patient'.
      { $match: { "senderInfo.role": "patient" } },

      // Stage 5: Limit the results to the top 5.
      { $limit: 5 },

      // Stage 6: We need to re-populate the conversation subject for the frontend.
      {
        $lookup: {
          from: "conversations",
          localField: "conversation",
          foreignField: "_id",
          as: "conversationInfo",
        },
      },
      { $unwind: "$conversationInfo" },

      // Stage 7: Project the final shape of the data to match what the frontend expects.
      {
        $project: {
          _id: 1,
          content: 1,
          isRead: 1,
          createdAt: 1,
          updatedAt: 1,
          sender: {
            // Re-shape the sender object
            _id: "$senderInfo._id",
            firstName: "$senderInfo.firstName",
            lastName: "$senderInfo.lastName",
            patientId: "$senderInfo.patientId",
          },
          conversation: {
            // Re-shape the conversation object
            _id: "$conversationInfo._id",
            subject: "$conversationInfo.subject",
          },
        },
      },
    ]);
    // --- END OF FIX ---

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching recent messages.",
    });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: "asc" }) // Sort chronologically for chat display
      .populate("sender", "firstName lastName role"); // Get sender info and role for styling

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching messages.",
    });
  }
};
export const getMyConversations = async (req, res) => {
  try {
    const patientId = req.user.id;
    const conversations = await Conversation.find({ participants: patientId })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName role", // Select fields you need for display
        },
      })
      .sort({ updatedAt: -1 }); // Show most recently updated conversations first

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching patient conversations:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching your conversations.",
    });
  }
};
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const patientId = req.user.id;

    // We can add a check here later to ensure the user is part of the conversation
    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.status(200).json({ message: "Message marked as read." });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred.",
    });
  }
};
export const sendPatientReply = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id; // Patient's ID

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    // Create the new message
    const newReply = new Message({
      conversation: conversationId,
      sender: senderId,
      content: content,
      isRead: false, // Important for notifying admins
    });
    await newReply.save();

    // Update the conversation's last message
    conversation.lastMessage = newReply._id;
    await conversation.save();

    const populatedReply = await Message.findById(newReply._id).populate(
      "sender",
      "firstName lastName role patientId"
    );

    // Notify all online admins/owners
    const adminRecipients = await User.find({
      role: { $in: ["admin", "owner"] },
    });
    for (const admin of adminRecipients) {
      const recipientSocketId = req.onlineUsers.get(admin._id.toString());
      if (recipientSocketId) {
        // Use the 'new_support_message' event so it appears in their dashboard list
        req.io
          .to(recipientSocketId)
          .emit("new_support_message", populatedReply);
        console.log(`Sent patient reply notification to admin ${admin._id}`);
      }
    }

    // Send the populated reply back to the patient for instant UI update
    res.status(201).json({ status: "success", data: populatedReply });
  } catch (error) {
    console.error("Error sending patient reply:", error);
    res.status(500).json({ message: "Error sending reply." });
  }
};
