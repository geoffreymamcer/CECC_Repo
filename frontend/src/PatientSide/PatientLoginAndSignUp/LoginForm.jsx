import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      if (response.data.status === "success") {
        // --- CHANGE HERE ---
        // DO NOT store the user object in localStorage.
        // localStorage.setItem("user", JSON.stringify(response.data.user)); // <-- REMOVE THIS LINE

        // ONLY store the token.
        localStorage.setItem("token", response.data.token);

        // Instead of navigating directly, you'll likely call a function
        // from a new AuthContext to set the user state and then navigate.
        // For simplicity here, we'll just navigate, but the next step is key.

        // A full reload ensures the app fetches the user with the new token.
        window.location.href = "/user-dashboard";
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
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
        disabled={isLoggingIn}
      >
        <span>{isLoggingIn ? "Logging in..." : "Log In"}</span>
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
