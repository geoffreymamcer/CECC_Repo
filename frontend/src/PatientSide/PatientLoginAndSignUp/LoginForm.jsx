import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = isLoading || isAuthLoading;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/user-dashboard");
    } else {
      setError(result.message || "Failed to log in. Please try again.");
      setIsLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="animate-fadeIn">
      <form className="w-full space-y-2" onSubmit={handleSubmit}>
        <FormGroup
          icon="User"
          type="email"
          value={email}
          placeholder="Email Address"
          disabled={isSubmitting}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormGroup
          icon="Lock"
          type="password"
          value={password}
          placeholder="Password"
          disabled={isSubmitting}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password Link - Aligned Right for better UX pattern */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openModal}
            className="text-sm font-semibold text-gray-500 hover:text-[#7F0000] transition-colors mb-4"
          >
            Forgot Password?
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/20 transition-all duration-300 flex items-center justify-center gap-2 group ${
            isSubmitting
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#7F0000] text-white hover:bg-[#600000] hover:-translate-y-1"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={22} />
              <span className="text-sm">Signing In...</span>
            </>
          ) : (
            <>
              Sign In{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">
              New to Candelaria Eye Care Clinic?
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleForm}
          className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:border-[#7F0000] hover:text-[#7F0000] hover:bg-red-50 transition-all duration-300"
        >
          Create an Account
        </button>
      </form>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
