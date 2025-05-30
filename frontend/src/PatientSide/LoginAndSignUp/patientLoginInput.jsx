import React, { useState } from "react";
import Input from "../../InputField";
import { useNavigate } from "react-router-dom";
import "./patientPortalLogin.css";

function PatientLogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      // Placeholder for future login logic
      // Simulate successful login and role verification
      const dummyUserData = {
        uid: "12345",
        email,
        role: "patient",
      };

      if (dummyUserData.role === "patient") {
        localStorage.setItem("user", JSON.stringify(dummyUserData));
        navigate("/user-dashboard");
      } else {
        setError("Access denied: this is not a patient account.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Failed to log in. Please try again.");
    }
  };

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        className="loginCredential patientLoginUsername"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        className="loginCredential patientLoginPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="submit"
        value="Log In"
        className="loginCredential loginButton"
      />

      <a href="" className="forgot-password-link"></a>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default PatientLogInForm;
