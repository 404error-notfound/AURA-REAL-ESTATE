import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Auto-load user from localStorage
  useEffect(() => {
    console.log("AuthProvider mounted, token:", token);
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing saved user:", e);
          setUser({ email: "placeholder@email.com" });
        }
      } else {
        setUser({ email: "placeholder@email.com" });
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response);
      
      if (response.data.status === "success" && response.data.data) {
        const { token, user } = response.data.data;
        
        // Store auth data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update context state
        setToken(token);
        setUser(user);
        
        console.log("Auth data stored, forcing navigation to dashboard...");
        
        // Wait a moment for the state to update
        setTimeout(() => {
          // Force a hard redirect
          window.location.href = "/dashboard";
        }, 100);
        
        return { success: true, message: "Login successful!" };
      } else {
        console.error("Invalid response format:", response);
        return { 
          success: false, 
          message: response.data?.message || response.data?.error || "Login failed" 
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.response?.data?.error || "Login failed" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  if (isLoading) {
    console.log("Auth is loading...");
    return <div>Loading...</div>;
  }

  console.log("Auth state:", { user, token });

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
