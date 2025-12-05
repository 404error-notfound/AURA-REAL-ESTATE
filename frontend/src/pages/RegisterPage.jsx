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
    <div className="min-h-screen flex items-center justify-center bg-[#D6E8EE] px-4 py-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#001B48]">Create Account</h2>
            <p className="text-gray-600 mt-2">Join AURA Real Estate today</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordGuidelines(true)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-transparent transition-colors"
              />
              
              {showPasswordGuidelines && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border text-sm">
                  <h3 className="font-semibold mb-2 text-gray-700">Password Requirements:</h3>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${passwordStrength.hasLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasLength ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasNumber ? '✓' : '○'}</span>
                      One number
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordStrength.hasSpecial ? '✓' : '○'}</span>
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#018ABE] hover:bg-[#0179A8] active:bg-[#016B91]'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-[#018ABE] hover:text-[#0179A8] font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
