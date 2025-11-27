import React, { useState, useEffect, useRef } from "react";
import { User, Tag, Mail, Send, X } from "lucide-react";
import instance from "../../api/axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

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
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
      <div className="relative bg-white w-full max-w-2xl h-[85vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn ring-1 ring-gray-900/5">
        <div className="p-5 border-b border-gray-100 bg-white z-10">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-deep-red">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-none">
                  {message.sender.firstName} {message.sender.lastName}
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> ID: {message.sender.patientId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 text-sm flex items-center text-gray-700">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-semibold mr-1">Subject:</span>
            {message.conversation.subject}
          </div>
        </div>

        {/* 🚀 MODIFIED: Chat Area Background */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/50"
        >
          {isLoadingChat ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
            </div>
          ) : (
            chatMessages.map((chatMsg) => {
              const isMe = chatMsg.sender._id === user.id;
              return (
                <div
                  key={chatMsg._id}
                  className={`flex items-end gap-2 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-sm relative group ${
                      isMe
                        ? "bg-deep-red text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{chatMsg.content}</p>
                    <p
                      className={`text-[10px] mt-2 opacity-70 text-right ${
                        isMe ? "text-red-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(chatMsg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 🚀 MODIFIED: Input Area styling */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form
            onSubmit={handleSendReply}
            className="flex items-center gap-3 relative"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 pl-5 pr-12 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-full focus:ring-2 focus:ring-red-100 focus:border-deep-red transition-all outline-none"
              placeholder="Type your reply here..."
            />
            <button
              type="submit"
              disabled={isSending || !replyContent.trim()}
              className="absolute right-2 p-2 bg-deep-red text-white rounded-full hover:bg-dark-red disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-xs text-center mt-2 animate-fadeIn">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
