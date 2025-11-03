import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // The interceptor in api/axios.js automatically adds the token header
          const response = await api.get("/users/me");
          setUser(response.data.data.user);
        } catch (error) {
          console.error("Token present but could not fetch user", error);
          localStorage.removeItem("token"); // Clean up invalid token
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);

      // No need to set axios defaults here anymore.

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    // No need to delete axios defaults here anymore.
    setUser(null);
    window.location.href = "/";
  };

  const authContextValue = { user, isLoading, isAuthLoading, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
