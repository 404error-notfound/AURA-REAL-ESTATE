import { useState } from "react";
import { registerUser } from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser(form);
    if (response.success) {
      setMessage("✅ Registered successfully! Please log in.");
    } else {
      setMessage(`❌ ${response.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#D6E8EE]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-[#001B48] mb-4">Register</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        
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
        
        <button className="bg-[#018ABE] text-white px-4 py-2 rounded w-full">Register</button>
        
        {message && <p className="mt-3 text-sm">{message}</p>}
      </form>
    </div>
  );
}
