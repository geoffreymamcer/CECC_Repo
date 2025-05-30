import React, { useState } from "react";
import Input from "../../InputField";
import { useNavigate } from "react-router-dom";
import "./patientPortalLogin.css";

function SignUpForm() {
  const [username, setUsername] = useState("");
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
      // Simulated successful registration
      const dummyUser = {
        uid: "dummy-uid-123",
        firstName,
        middleName,
        lastName,
        username,
        email,
        role: "patient",
      };

      console.log("User created:", dummyUser);
      localStorage.setItem("user", JSON.stringify(dummyUser));
      alert("Account Created Successfully");
      navigate("/");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create account.");
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
      />

      <input
        type="text"
        placeholder="Username"
        className="loginCredential patientSignupUserName"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="loginCredential patientSignupEmail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="loginCredential patientSignupPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="loginCredential patientSignupConfirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <input
        type="submit"
        value="Sign Up"
        className="loginCredential signupButton"
        disabled={isCreatingUser}
      />

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SignUpForm;
