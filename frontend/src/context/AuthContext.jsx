// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // --- 1. ADD A NEW STATE FOR LOGIN/LOGOUT LOADING ---
  // This helps prevent race conditions during authentication changes.
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(
            "http://localhost:5000/api/users/me"
          );
          setUser(response.data.data.user);
        } catch (error) {
          console.error("Could not fetch user", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setIsAuthLoading(true); // <-- 2. SET LOADING TO TRUE AT THE START
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/admin-login",
        { email, password }
      );
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
      setIsAuthLoading(false); // <-- 3. SET LOADING TO FALSE AT THE END
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    // 4. FIX LOGOUT REDIRECT to point to your admin login page, not the homepage.
    window.location.href = "/";
  };

  const authContextValue = {
    user,
    isLoading,
    isAuthLoading, // <-- 5. EXPOSE THE NEW LOADING STATE
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* We wait for the initial page load check to complete before rendering */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
