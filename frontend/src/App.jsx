import { Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/dashboard/dashboard";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#D6E8EE] flex flex-col">
        {/* Navbar */}
        <nav className="bg-[#001B48] text-white px-8 py-4 flex justify-between items-center">
          <h1 className="font-bold text-2xl">My App</h1>
          <div className="flex gap-8">
            <Link to="/register" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Register</Link>
            <Link to="/login" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Login</Link>
            <Link to="/dashboard" className="px-4 py-2 hover:bg-[#002B6D] rounded-lg transition-colors">Dashboard</Link>
          </div>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<h2 className="p-6 text-center">404 Page Not Found</h2>} />
        </Routes>
      </div>
  );
}
