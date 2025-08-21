import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        setMessage("✅ " + result.message);
      } else {
        setMessage("❌ " + result.message);
      }
    } catch (error) {
      setMessage("❌ An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#97CADB]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-[#001B48] mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className={`bg-[#02457A] text-white px-4 py-2 rounded w-full transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#013357]'
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className={`mt-3 text-sm text-center ${
            message.includes('✅') ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
