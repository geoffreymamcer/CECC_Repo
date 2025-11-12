import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/user-dashboard");
    } else {
      setError(result.message || "Failed to log in. Please try again.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <FormGroup
          icon="user"
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormGroup
          icon="lock"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-dark-red text-white py-3 rounded-lg font-bold btn-hover transition-all duration-300 flex items-center justify-center space-x-2"
          disabled={isAuthLoading}
        >
          <span>{isAuthLoading ? "Logging in..." : "Log In"}</span>
          <i className="fas fa-arrow-right animate-pulse-slow" />
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
