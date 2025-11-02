import React, { createContext, useState, useEffect, useContext } from "react";
import instance from "../api/axios";

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
          const response = await instance.get("/users/me");
          setUser(response.data.data.user);
        } catch (error) {
          console.error("Token present but could not fetch user", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setIsAuthLoading(true);
    try {
      const response = await instance.post("/users/login", { email, password });

      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);

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
    setUser(null);
    window.location.href = "/"; // Redirect to the patient login page
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
