import React, { useState, useEffect } from "react";
import instance from "../api/axios";

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

      // Set the success message from the server's response
      setSuccessMessage(response.data.message || "Message sent successfully!");

      // Automatically close the modal after showing the success message
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      // Set an error message if the API call fails
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      // Only stop loading on error, so the user can't resubmit on success
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-lg rounded-lg shadow-xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-dark-red p-2 rounded-full">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Contact Support
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* --- 4. UPDATE FORM TO HANDLE LOADING/FEEDBACK STATES --- */}
        {successMessage ? (
          // Show success message view
          <div className="p-10 text-center">
            <div className="text-green-500 mb-4">
              <i className="fas fa-check-circle text-5xl"></i>
            </div>
            <p className="text-lg text-gray-700">{successMessage}</p>
          </div>
        ) : (
          // Show form view
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-red focus:border-deep-red transition-shadow"
                  placeholder="e.g., Issue with my appointment"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-red focus:border-deep-red transition-shadow"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>
              {/* Display API error message here */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-dark-red text-white font-semibold rounded-lg shadow-md hover:bg-deep-red transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
