import { useState } from "react";
import { registerUser } from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordGuidelines, setShowPasswordGuidelines] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validatePassword = (password) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      // Password validation
      if (form.password !== form.confirmPassword) {
        setMessage("❌ Passwords do not match");
        return;
      }

      // Check password strength
      const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
      if (!isPasswordStrong) {
        setMessage("❌ Password does not meet all requirements");
        return;
      }

      setIsLoading(true);

      // Basic validation
      if (!form.name || !form.email || !form.password) {
        setMessage("❌ All fields are required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setMessage("❌ Please enter a valid email address");
        return;
      }

      console.log('Submitting registration data:', {
        name: form.name,
        email: form.email,
        password: form.password
      });

      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        user_type: "CLIENT" // Setting default user type
      });
      
      console.log('Registration response:', response);

      if (response.success) {
        setMessage("✅ Registered successfully! Please log in.");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        // Optionally redirect to login page after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setMessage(`❌ ${response.message}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage("❌ An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#D6E8EE] py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-[#001B48] mb-6 text-center">Register</h2>
        
        <div className="flex flex-col items-center">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-64 p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#018ABE]"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-64 p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#018ABE]"
          />
          
          <div className="relative mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordGuidelines(true)}
              required
              className="w-64 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#018ABE]"
            />
          
          {showPasswordGuidelines && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border text-sm w-64">
              <h3 className="font-semibold mb-2">Password Requirements:</h3>
              <ul className="space-y-1">
                <li className={`flex items-center ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordStrength.hasLength ? '✓' : '○'} At least 8 characters
                </li>
                <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordStrength.hasUppercase ? '✓' : '○'} One uppercase letter
                </li>
                <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordStrength.hasLowercase ? '✓' : '○'} One lowercase letter
                </li>
                <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordStrength.hasNumber ? '✓' : '○'} One number
                </li>
                <li className={`flex items-center ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-600'}`}>
                  {passwordStrength.hasSpecial ? '✓' : '○'} One special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-64 p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-[#018ABE]"
        />
        
        <button 
          type="submit"
          disabled={isLoading}
          className={`bg-[#018ABE] text-white px-4 py-2 rounded w-64 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0179A8]'
          }`}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        
        {message && (
          <p className={`mt-3 text-sm text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        </div>
      </form>
    </div>
  );
}
