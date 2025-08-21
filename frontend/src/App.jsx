import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/dashboard/dashboard";
import Leads from "./pages/dashboard/leads";
import Properties from "./pages/dashboard/properties";
import Clients from "./pages/dashboard/clients";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token } = useContext(AuthContext);
  
  console.log("App rendered, token:", token);

  return (
    <div className="min-h-screen w-full bg-[#D6E8EE] flex flex-col">
        {/* Mobile-responsive Navbar */}
        <nav className="bg-[#001B48] text-white px-4 md:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-xl md:text-2xl">AURA Real Estate</Link>
          <div className="flex gap-2 md:gap-8">
            {!token ? (
              <>
                <Link to="/register" className="px-2 md:px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors text-sm md:text-base">Register</Link>
                <Link to="/login" className="px-2 md:px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors text-sm md:text-base">Login</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="px-2 md:px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors text-sm md:text-base">Dashboard</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                  className="px-2 md:px-4 py-2 hover:bg-red-600 rounded-lg transition-colors text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          <Route path="/register" element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } />
          <Route path="/login" element={
            token ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <PrivateRoute>
                <Leads />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/properties"
            element={
              <PrivateRoute>
                <Properties />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/clients"
            element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
  );
}
