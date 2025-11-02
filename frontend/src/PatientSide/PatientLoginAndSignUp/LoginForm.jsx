import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- 2. GET THE LOGIN FUNCTION and isAuthLoading FROM THE CONTEXT ---
  const { login, isAuthLoading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // --- 3. CALL THE CONTEXT LOGIN FUNCTION ---
    const result = await login(email, password);

    if (result.success) {
      // --- 4. NAVIGATE, DO NOT RELOAD ---
      // The context has already set the user state, so we can just navigate.
      navigate("/user-dashboard");
    } else {
      setError(result.message || "Failed to log in. Please try again.");
    }
  };

  return (
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
        // --- 5. USE isAuthLoading FROM THE CONTEXT ---
        disabled={isAuthLoading}
      >
        <span>{isAuthLoading ? "Logging in..." : "Log In"}</span>
        <i className="fas fa-arrow-right animate-pulse-slow" />
      </button>

      <div className="text-center pt-2">
        <a
          href="#"
          className="text-gray-600 underline hover:text-dark-red transition-colors duration-200"
        >
          Forgot password? <i className="fas fa-question-circle ml-1" />
        </a>
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
  );
}
