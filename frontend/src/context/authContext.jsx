import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  // Auto-load user from localStorage
  useEffect(() => {
    if (token) {
      setUser({ email: "placeholder@email.com" }); 
      // Later: decode JWT or fetch user profile
    }
  }, [token]);

  const login = async (email, password) => {
    try {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser({ email });
    navigate("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
    try {
      // Replace with your Flask backend API
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser({ email });
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
