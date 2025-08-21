import { useState } from "react";
import { loginUser } from "../services/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(form);
    if (response.success) {
      setToken(response.data.token);
      setMessage("✅ Login successful!");
      localStorage.setItem("token", response.data.token);
    } else {
      setMessage(`❌ ${response.message}`);
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

        <button className="bg-[#02457A] text-white px-4 py-2 rounded w-full">Login</button>

        {message && <p className="mt-3 text-sm">{message}</p>}
        {token && <p className="text-xs text-green-600 break-all">Token: {token}</p>}
      </form>
    </div>
  );
}
