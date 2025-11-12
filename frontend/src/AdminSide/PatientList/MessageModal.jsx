// MessageModal.jsx

import React, { useState, useEffect, useRef } from "react";
import { User, Tag, Mail, Send } from "lucide-react";
import instance from "../../api/axios";
import { useSocket } from "../../context/SocketContext"; // 👈 IMPORT SOCKET HOOK
import { useAuth } from "../../context/AuthContext"; // 👈 IMPORT AUTH HOOK

export default function MessageModal({ isOpen, onClose, message }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const chatContainerRef = useRef(null); // For auto-scrolling
  const socket = useSocket();
  const { user } = useAuth(); // Get the current admin user

  // --- 1. FETCH CHAT HISTORY WHEN MODAL OPENS ---
  useEffect(() => {
    const fetchMessages = async () => {
      if (isOpen && message) {
        setIsLoadingChat(true);
        try {
          const res = await instance.get(
            `/messages/conversation/${message.conversation._id}`
          );
          setChatMessages(res.data);
        } catch (err) {
          setError("Could not load message history.");
        } finally {
          setIsLoadingChat(false);
        }
      }
    };
    fetchMessages();
  }, [isOpen, message]);

  // --- 2. SETUP REAL-TIME LISTENER FOR NEW MESSAGES ---
  useEffect(() => {
    if (!socket || !message) return;

    // Listen for replies from this specific patient
    const handleNewMessage = (newMessage) => {
      // Ensure the message belongs to the currently open conversation
      if (newMessage.conversation === message.conversation._id) {
        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("new_message_reply", handleNewMessage); // This is for when the patient replies

    // Cleanup listener on component unmount or when modal closes
    return () => {
      socket.off("new_message_reply", handleNewMessage);
    };
  }, [socket, message]);

  // --- 3. AUTO-SCROLL TO THE LATEST MESSAGE ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSending(true);
    setError("");

    try {
      const res = await instance.post(
        `/messages/reply/${message.conversation._id}`,
        { content: replyContent, patientId: message.sender._id }
      );
      // --- REAL-TIME UI UPDATE ---
      // Add the new message to our state instantly instead of re-fetching
      setChatMessages((prev) => [...prev, res.data.data]);
      setReplyContent("");
    } catch (err) {
      setError("Failed to send reply.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl h-[90vh] max-h-[700px] rounded-2xl shadow-xl animate-scaleIn flex flex-col">
        {/* Header with Patient Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                {message.sender.firstName} {message.sender.lastName}
              </h3>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Tag className="w-3 h-3 mr-1.5" /> {message.sender.patientId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            <strong>Subject:</strong>
            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded">
              {message.conversation.subject}
            </span>
          </div>
        </div>

        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
        >
          {isLoadingChat ? (
            <p className="text-center text-gray-500">Loading history...</p>
          ) : (
            chatMessages.map((chatMsg) => (
              <div
                key={chatMsg._id}
                className={`flex items-end gap-2 ${
                  chatMsg.sender._id === user.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-md p-3 rounded-2xl ${
                    chatMsg.sender._id === user.id
                      ? "bg-[#8B0000] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{chatMsg.content}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      chatMsg.sender._id === user.id
                        ? "text-red-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(chatMsg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendReply} className="flex items-center gap-3">
            <textarea
              rows="1"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-full focus:ring-2 focus:ring-deep-red resize-none"
              placeholder="Type your reply..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={isSending || !replyContent.trim()}
              className="p-3 bg-dark-red text-white rounded-full hover:bg-deep-red transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-xs text-center mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
