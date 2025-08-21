import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

export default function Login() {
    const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        setSuccessMessage(result.message || "Login successful!");
        // The navigation will be handled by the auth context
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-extra-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-dark">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded mb-4 focus:outline-accent"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded mb-6 focus:outline-accent"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white p-2 rounded hover:bg-accent transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-500 text-sm text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
