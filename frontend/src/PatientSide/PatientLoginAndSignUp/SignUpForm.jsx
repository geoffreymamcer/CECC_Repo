import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import instance from "../../api/axios";
import { Loader2 } from "lucide-react";

export default function SignupForm({ toggleForm }) {
  const [firstName, setFirstname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State to manage which step of the form is visible
  const [formStep, setFormStep] = useState("signup"); // 'signup' or 'verify'

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isLoading) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Send user details to get a verification code
      const response = await instance.post("/users/signup", {
        firstName,
        middleName,
        lastName,
        phone_number: phoneNumber,
        email,
        password,
      });

      if (response.data.status === "success") {
        setMessage(response.data.message);
        setFormStep("verify"); // Move to the verification step
      }
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError(
        err.response?.data?.message || "Failed to start signup process."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isLoading) return;
    setIsLoading(true);

    try {
      // Step 2: Verify the code and create the account
      const response = await instance.post("/users/verify-email", {
        email,
        verificationCode,
      });

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Account Created Successfully!");
        toggleForm(); // Switch to login form or close modal

        // Reset all fields
        setFirstname("");
        setMiddleName("");
        setLastName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setError("");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError(err.response?.data?.message || "Failed to verify account.");
    } finally {
      setIsLoading(false);
    }
  };

  if (formStep === "verify") {
    return (
      <form className="w-full space-y-4" onSubmit={handleVerificationSubmit}>
        <h3 className="text-xl font-bold text-center text-gray-800">
          Verify Your Email
        </h3>
        {message && <p className="success-message">{message}</p>}

        <FormGroup
          icon="key"
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          disabled={isLoading}
        />

        {error && <p className="error-message">{error}</p>}

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading
              ? "bg-red-800 cursor-not-allowed opacity-80"
              : "bg-red-800 text-white btn-hover"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} color="white" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify and Create Account"
          )}
        </button>
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setFormStep("signup")}
            className="text-sm text-gray-600 hover:underline"
            disabled={isLoading}
          >
            Back to Sign Up
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="w-full space-y-4" onSubmit={handleSignupSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup
          icon="user"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstname(e.target.value)}
          disabled={isLoading}
        />
        <FormGroup
          icon="user"
          type="text"
          placeholder="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Second row: Last Name (full width) */}
      <FormGroup
        icon="user"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={isLoading}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup
          icon="envelope"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <FormGroup
          icon="phone"
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup
          icon="lock"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <FormGroup
          icon="lock"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
          isLoading
            ? "bg-red-800 cursor-not-allowed opacity-80"
            : "bg-red-800 text-white btn-hover"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} color="white" />
            <span>Sending Code...</span>
          </>
        ) : (
          "Sign Up"
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-100">
        <span className="text-gray-700">Have an Account Already?</span>
        <button
          type="button"
          onClick={toggleForm}
          className="ml-2 bg-dark-red text-white px-4 py-1 rounded-lg text-sm btn-hover transition-all duration-300"
          disabled={isLoading}
        >
          Log In
        </button>
      </div>
    </form>
  );
}
