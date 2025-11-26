import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Loader2 } from "lucide-react";

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
    <>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <FormGroup
          icon="User"
          type="email"
          value={email}
          placeholder="Email"
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

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isSubmitting
              ? "bg-red-800 cursor-not-allowed opacity-80"
              : "bg-dark-red text-white btn-hover"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} color="white" />
              <span className="text-white">Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={openModal}
            className="text-gray-600 underline hover:text-dark-red transition-colors duration-200"
          >
            Forgot password? <i className="fas fa-question-circle ml-1" />
          </button>
        </div>

        <div className="text-center pt-4 border-t border-gray-100">
          <span className="text-gray-700">Do not have an account?</span>
          <button
            type="button"
            onClick={toggleForm}
            className="ml-2 bg-dark-red text-white px-4 py-1 rounded-lg text-sm btn-hover transition-all duration-300"
          >
            Create
          </button>
        </div>
      </form>
      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
