import React, { useState, useEffect } from "react";
import instance from "../api/axios";
// 👇 🤖 EMOJI: MODIFIED - Imported Lucide icons for consistent styling
import {
  X,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
// 👆 🤖 EMOJI: END CHANGE

export default function ContactSupportModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubject("");
        setMessage("");
        setIsLoading(false);
        setError("");
        setSuccessMessage("");
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await instance.post("messages/support", {
        subject,
        content: message,
      });

      setSuccessMessage(response.data.message || "Message sent successfully!");

      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // 👇 🤖 EMOJI: MODIFIED - Updated backdrop to use blur and darker overlay
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
      {/* 👆 🤖 EMOJI: END CHANGE */}

      <div
        // 👇 🤖 EMOJI: MODIFIED - Changed rounded corners to 3xl and added overflow-hidden
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-scaleIn overflow-hidden"
        // 👆 🤖 EMOJI: END CHANGE
        onClick={(e) => e.stopPropagation()}
      >
        {/* 👇 🤖 EMOJI: ADDED - Premium Header with Gradient and Cubes Pattern */}
        <div className="bg-gradient-to-r from-[#7F0000] to-[#5a0000] p-8 text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-inner border border-white/10">
              <HelpCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold leading-tight">
                Contact Support
              </h3>
              <p className="text-white/70 text-sm">We're here to help you.</p>
            </div>
          </div>
        </div>
        {/* 👆 🤖 EMOJI: END CHANGE */}

        {successMessage ? (
          // --- SUCCESS VIEW ---
          <div className="p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Message Sent!
            </h4>
            <p className="text-gray-500">
              Thank you for reaching out. Our team will get back to you shortly.
            </p>
          </div>
        ) : (
          // --- FORM VIEW ---
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-6">
              {/* Subject Input */}
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                >
                  Subject
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <MessageSquare size={18} />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    // 👇 🤖 EMOJI: MODIFIED - Modern input styling (gray bg, focus white)
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] transition-all font-medium placeholder-gray-400"
                    // 👆 🤖 EMOJI: END CHANGE
                    placeholder="Briefly describe your issue"
                    required
                  />
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                >
                  Details
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#7F0000]/20 focus:border-[#7F0000] transition-all font-medium placeholder-gray-400 resize-none"
                  placeholder="Please provide as much detail as possible..."
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                // 👇 🤖 EMOJI: MODIFIED - Gradient button with shadow
                className="px-8 py-2.5 bg-gradient-to-r from-[#7F0000] to-[#600000] text-white font-bold rounded-xl shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                // 👆 🤖 EMOJI: END CHANGE
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
