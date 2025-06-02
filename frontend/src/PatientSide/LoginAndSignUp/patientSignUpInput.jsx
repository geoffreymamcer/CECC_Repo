import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./patientPortalLogin.css";

function SignUpForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [firstName, setFirstname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isCreatingUser) return;
    setIsCreatingUser(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsCreatingUser(false);
      return;
    }

    try {
      // Create user account
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          firstName,
          middleName,
          lastName,
          phone_number: phoneNumber,
          email,
          password,
          role: "patient",
        }
      );

      if (response.data.status === "success") {
        // Store the token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Account Created Successfully");
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <form className="signUpForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        className="loginCredential patientSignupFirstName"
        value={firstName}
        onChange={(e) => setFirstname(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Middle Name"
        className="loginCredential patientSignupMiddleName"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="loginCredential patientSignupLastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Phone Number"
        className="loginCredential patientSignupPhoneNumber"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="loginCredential patientSignupEmail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="loginCredential patientSignupPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="loginCredential patientSignupConfirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <input
        type="submit"
        value={isCreatingUser ? "Creating Account..." : "Sign Up"}
        className="loginCredential signupButton"
        disabled={isCreatingUser}
      />

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SignUpForm;
