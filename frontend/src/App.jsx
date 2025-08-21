import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedPage from "./pages/ProtectedPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#D6E8EE]">
        {/* Navbar */}
        <nav className="bg-[#001B48] text-white p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">My App</h1>
          <div className="space-x-4">
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/protected" className="hover:underline">Protected</Link>
          </div>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="*" element={<h2 className="p-6 text-center">404 Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}
