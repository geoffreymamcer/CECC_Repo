// LoginForm.jsx

import React, { useState } from "react";
import InputField from "./InputField";
import "./AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const result = await login(email, password);

    if (result.success) {
      navigate("/cecc-admin-dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12">
      <div className="w-full max-w-md">
        {/* ... your existing JSX for the form header ... */}
        <div className="text-center mb-8">
          <div className="avatar mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            <i className="fas fa-user-shield text-primary-500 text-4xl"></i>
          </div>
          <h1 className="admin-title text-2xl font-bold text-gray-800">
            Admin Account
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ... Your InputField components and the rest of the form ... */}
          {/* This part does not need to change. */}
          <InputField
            type="email"
            name="email"
            placeholder="Email"
            icon="fas fa-user"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            type="password"
            name="password"
            placeholder="Password"
            icon="fas fa-lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isAuthLoading}
            className="login-btn w-full py-3 px-4 bg-primary-700 text-white font-semibold rounded-lg shadow-button hover:bg-primary-600 transition-all duration-300"
            style={{
              background: "linear-gradient(to right, #800000, #b30000)",
            }}
          >
            {isAuthLoading ? "Logging In..." : "Log In"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>

        {/* ... your existing JSX for the form footer ... */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <a
              href="#"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
