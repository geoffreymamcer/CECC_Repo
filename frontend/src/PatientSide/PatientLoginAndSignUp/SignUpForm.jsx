import React, { useState } from "react";
import FormGroup from "./FormGroup";
import "./PatientLogin.css";
import axios from "axios";

export default function SignupForm({ toggleForm }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [firstName, setFirstname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

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
        toggleForm();

        setFirstname("");
        setMiddleName("");
        setLastName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <FormGroup
        icon="user"
        type="text"
        placeholder="First Name"
        onChange={(e) => setFirstname(e.target.value)}
      />
      <FormGroup
        icon="user"
        type="text"
        placeholder="Middle Name"
        onChange={(e) => setMiddleName(e.target.value)}
      />
      <FormGroup
        icon="user"
        type="text"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <FormGroup
        icon="envelope"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormGroup
        icon="phone"
        type="tel"
        placeholder="Phone Number"
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <FormGroup
        icon="lock"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormGroup
        icon="lock"
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p className="error-message">{error}</p>}

      <input
        type="submit"
        className="w-full bg-red-800 text-white py-3 rounded-lg font-bold btn-hover transition-all duration-300"
        disabled={isCreatingUser}
        value={isCreatingUser ? "Creating Account..." : "Sign Up"}
      />

      <div className="text-center pt-4 border-t border-gray-100">
        <span className="text-gray-700">Have an Account Already?</span>
        <button
          type="button"
          onClick={toggleForm}
          className="ml-2 bg-dark-red text-white px-4 py-1 rounded-lg text-sm btn-hover transition-all duration-300"
        >
          Log In
        </button>
      </div>
    </form>
  );
}
