import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import instance from "../../api/axios";
import { Loader2, CheckCircle, Mail } from "lucide-react";

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
  const [formStep, setFormStep] = useState("signup");

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
        setFormStep("verify");
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
      const response = await instance.post("/users/verify-email", {
        email,
        verificationCode,
      });
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Account Created Successfully!");
        toggleForm();
        // Reset fields...
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
      <div className="animate-fadeIn">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Check your Email</h3>
          <p className="text-gray-500 text-sm mt-2">
            {message || "We sent a code to " + email}
          </p>
        </div>

        <form className="w-full space-y-4" onSubmit={handleVerificationSubmit}>
          <FormGroup
            icon="key"
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
          />

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold bg-[#7F0000] text-white hover:bg-[#600000] transition-all shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center gap-2">
                <Loader2 className="animate-spin" /> Verifying...
              </div>
            ) : (
              "Verify & Create Account"
            )}
          </button>
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setFormStep("signup")}
              className="text-sm text-gray-500 hover:text-[#7F0000] underline"
              disabled={isLoading}
            >
              Change Email / Back
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form
      className="w-full space-y-3 animate-fadeIn"
      onSubmit={handleSignupSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      <FormGroup
        icon="user"
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl font-bold bg-[#7F0000] text-white hover:bg-[#600000] transition-all shadow-lg mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex justify-center gap-2">
            <Loader2 className="animate-spin" /> Processing...
          </div>
        ) : (
          "Sign Up"
        )}
      </button>

      <div className="text-center pt-6">
        <span className="text-gray-500 text-sm">Already have an account?</span>
        <button
          type="button"
          onClick={toggleForm}
          className="ml-2 text-[#7F0000] font-bold hover:underline text-sm"
        >
          Log In
        </button>
      </div>
    </form>
  );
}
