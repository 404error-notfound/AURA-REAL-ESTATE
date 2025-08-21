import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  if (!token) {
    // No token found, redirect to login and remember where they were trying to go
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token exists, render the protected component
  console.log("Token found, rendering protected route");
  return children;
}
