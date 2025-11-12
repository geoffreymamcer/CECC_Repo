// In the same directory as DashboardLayout.jsx

import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import instance from "../../api/axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export default function PatientMessageModal({ isOpen, onClose, conversation }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const chatContainerRef = useRef(null);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (isOpen && conversation) {
        setIsLoadingChat(true);
        try {
          const res = await instance.get(
            `/messages/conversation/${conversation._id}`
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
  }, [isOpen, conversation]);

  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversation === conversation._id) {
        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("new_message_reply", handleNewMessage);

    return () => socket.off("new_message_reply", handleNewMessage);
  }, [socket, conversation]);

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
        `/messages/patient-reply/${conversation._id}`,
        { content: replyContent }
      );
      // Add the new message to our state instantly
      setChatMessages((prev) => [...prev, res.data.data]);
      setReplyContent("");
    } catch (err) {
      setError("Failed to send reply. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl h-[90vh] max-h-[700px] rounded-2xl shadow-xl animate-scaleIn flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-gray-500" />
                Conversation
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Subject:</strong> {conversation.subject}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

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
                <div
                  className={`max-w-md p-3 rounded-2xl ${
                    chatMsg.sender._id === user.id
                      ? "bg-[#8B0000] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{chatMsg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
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
