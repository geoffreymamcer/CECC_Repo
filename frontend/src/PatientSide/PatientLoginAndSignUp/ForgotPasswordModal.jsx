import React, { useState, useEffect } from "react";
import FormGroup from "./FormGroup";
import instance from "../../api/axios";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- 2. CONSOLIDATE STATE FOR LOADING AND ERRORS ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isExiting, setIsExiting] = useState(false);

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setIsExiting(false);
        setEmail("");
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccessMessage("");
        setIsLoading(false);
      }, 300); // Corresponds to animation duration
    }
  }, [isOpen]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await instance.post("/users/forgot-password", { email });
      // The backend sends a generic message, so we just proceed
      setIsExiting(true);
      setTimeout(() => {
        setStep(2);
        setIsExiting(false);
      }, 300);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await instance.post("/users/verify-reset-code", { email, code });
      setIsExiting(true);
      setTimeout(() => {
        setStep(3);
        setIsExiting(false);
      }, 300);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to verify code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await instance.post("/users/reset-password", {
        email,
        code,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage(response.data.message);
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while changing the password."
      );
      setIsLoading(false);
    }
    // No finally block here, as we want the button to stay disabled on success
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white animate-scaleIn">
        <div className="text-center">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>

          {step === 1 && (
            <div className={isExiting ? "animate-fadeOut" : ""}>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Forgot Password
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Enter your email and we'll send a code to reset your password.
                </p>
                <form onSubmit={handleSendCode} className="mt-4 space-y-4">
                  <FormGroup
                    icon="envelope"
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-dark-red text-white py-2 px-4 rounded-lg font-bold btn-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Code"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={isExiting ? "animate-fadeOut" : "animate-fadeInUp"}>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Enter Verification Code
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  A verification code was sent to your email.
                </p>
                <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                  <FormGroup
                    icon="key"
                    type="text"
                    value={code}
                    placeholder="Enter verification code"
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-dark-red text-white py-2 px-4 rounded-lg font-bold btn-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeInUp">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Set New Password
              </h3>
              <div className="mt-2 px-7 py-3">
                {successMessage ? (
                  <p className="text-green-600 text-center">{successMessage}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Create a new password for your account.
                  </p>
                )}
                <form
                  onSubmit={handlePasswordChange}
                  className="mt-4 space-y-4"
                >
                  <FormGroup
                    icon="lock"
                    type="password"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <FormGroup
                    icon="lock"
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm New Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-dark-red text-white py-2 px-4 rounded-lg font-bold btn-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
