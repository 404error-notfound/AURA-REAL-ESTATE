import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-primary-dark text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Aura Real Estate</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-accent">Home</Link>
        <Link to="/about" className="hover:text-accent">About</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-accent">Dashboard</Link>
            <button onClick={logout} className="bg-accent px-3 py-1 rounded hover:bg-light transition">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-primary px-3 py-1 rounded hover:bg-accent transition">Login</Link>
        )}
      </div>
    </nav>
  );
}
