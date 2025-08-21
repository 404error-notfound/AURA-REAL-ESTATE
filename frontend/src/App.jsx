import { Routes, Route, Link, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/dashboard/dashboard";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <div className="min-h-screen w-full bg-[#D6E8EE] flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#001B48] text-white px-8 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl">AURA Real Estate</Link>
          <div className="flex gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Register</Link>
                <Link to="/login" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Login</Link>
              </>
            ) : (
              <Link to="/dashboard" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Dashboard</Link>
            )}
          </div>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}
