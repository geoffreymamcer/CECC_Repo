import React, { useState } from "react";
import Input from "./InputField";
import CECCBANNER from "./AdminSideAssets/candelariaClinicCover.png";
import icon from "./AdminSideAssets/circle-user-solid.svg";
import "./AdminSide.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

function AdminLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/api/admin/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store the token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        role: "admin" // Ensure role is set to admin
      }));

      // Set the authorization header for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Configure axios base URL
      axios.defaults.baseURL = "http://localhost:5000";

      // Navigate to admin dashboard on successful login
      navigate("/cecc-admin-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="adminLogInDiv">
      <div className="logInContainer">
        <div className="child logo">
          <img className="logoImage" src={CECCBANNER} alt="Clinic Logo"></img>
        </div>
        <form className="child form" onSubmit={handleSubmit}>
          <img className="adminLoginUserLogo" src={icon} alt="User Icon" />
          <h3 className="loginText">Admin Account</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Input
            type="email"
            className="adminInput username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            className="adminInput password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="submit"
            className="adminInput loginButton"
            value="Log In"
          />
        </form>
      </div>
    </div>
  );
}

export default AdminLogIn;
