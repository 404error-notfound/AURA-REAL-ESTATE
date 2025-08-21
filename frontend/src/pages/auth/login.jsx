import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

export default function Login() {
    const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
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
          className="w-full bg-primary text-white p-2 rounded hover:bg-accent transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
