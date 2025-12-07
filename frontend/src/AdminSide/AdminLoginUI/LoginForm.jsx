// --- START OF FILE LoginForm.jsx ---

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "./InputField";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import "./AdminLogin.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { adminLogin, isAuthLoading } = useAuth();

  // Local loading state to handle immediate UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = isLoading || isAuthLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        navigate("/cecc-admin-dashboard");
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center animate-fade-in delay-200">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Please enter your details to sign in.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-2" onSubmit={handleSubmit}>
          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="email"
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-4 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 transform transition-all duration-300 
              flex items-center justify-center space-x-2 
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed scale-[0.98]"
                  : "bg-gradient-to-r from-[#800000] to-[#b30000] hover:to-[#990000] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} color="white" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Security Footer */}
      </div>
    </div>
  );
};

export default LoginForm;
