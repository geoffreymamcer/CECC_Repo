import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./patientPortalLogin.css";

function PatientLogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    console.log('Login form submitted');

    if (isLoggingIn) {
      console.log('Login already in progress');
      return;
    }
    setIsLoggingIn(true);
    console.log('Making login request...');

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      console.log('Login response:', response.data);

      if (response.data.status === "success") {
        console.log('Login successful, storing token and user data');
        // Store the token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log('Navigating to /user-dashboard');
        navigate("/user-dashboard");
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
    <form className="loginForm" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className="loginCredential patientLoginUsername"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="loginCredential patientLoginPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="submit"
        value={isLoggingIn ? "Logging in..." : "Log In"}
        className="loginCredential loginButton"
        disabled={isLoggingIn}
      />

      <a href="" className="forgot-password-link"></a>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default PatientLogInForm;
