import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import InputField from '../../components/Forms/InputField';
import { useValidation } from '../../hooks/useValidation';
import { validateEmail, validatePassword, validateName, validatePhone } from '../../utils/validators';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { errors, validateField, validateForm, clearFieldError, setErrors } = useValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
    if (errors[name]) {
      clearFieldError(name);
    }
    
    // Clear confirm password error if password matches
    if (name === 'password' && errors.confirmPassword && value === form.confirmPassword) {
      clearFieldError('confirmPassword');
    }
    if (name === 'confirmPassword' && errors.confirmPassword && value === form.password) {
      clearFieldError('confirmPassword');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate fields on blur
    switch (name) {
      case 'firstName':
        if (value.trim()) validateField(name, value, (val) => validateName(val, 'First name'));
        break;
      case 'lastName':
        if (value.trim()) validateField(name, value, (val) => validateName(val, 'Last name'));
        break;
      case 'email':
        if (value.trim()) validateField(name, value, validateEmail);
        break;
      case 'phone':
        if (value.trim()) validateField(name, value, validatePhone);
        break;
      case 'password':
        if (value) validateField(name, value, validatePassword);
        break;
      case 'confirmPassword':
        if (value) {
          const confirmPasswordValidator = (val) => {
            if (!val) {
              return { isValid: false, errors: ['Please confirm your password'] };
            }
            if (val !== form.password) {
              return { isValid: false, errors: ['Passwords do not match'] };
            }
            return { isValid: true, errors: [] };
          };
          validateField(name, value, confirmPasswordValidator);
        }
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Comprehensive form validation
    const validators = {
      firstName: (val) => validateName(val, 'First name'),
      lastName: (val) => validateName(val, 'Last name'),
      email: validateEmail,
      phone: validatePhone,
      password: validatePassword,
      confirmPassword: (val) => {
        if (!val) {
          return { isValid: false, errors: ['Please confirm your password'] };
        }
        if (val !== form.password) {
          return { isValid: false, errors: ['Passwords do not match'] };
        }
        return { isValid: true, errors: [] };
      }
    };

    const { isValid, errors: validationErrors } = validateForm(form, validators);
    
    if (!isValid) {
      setErrors(validationErrors);
      setError("Please fix the validation errors below");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      
      if (result.success) {
        setSuccessMessage(result.message || "Registration successful!");
        // Clear form on success
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your first name"
                required
                error={errors.firstName?.[0]}
                validator={(val) => validateName(val, 'First name')}
                autoComplete="given-name"
              />
              
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your last name"
                required
                error={errors.lastName?.[0]}
                validator={(val) => validateName(val, 'Last name')}
                autoComplete="family-name"
              />
            </div>
            
            <InputField
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              required
              error={errors.email?.[0]}
              validator={validateEmail}
              autoComplete="email"
            />
            
            <InputField
              label="Phone Number (Optional)"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              error={errors.phone?.[0]}
              validator={validatePhone}
              autoComplete="tel"
            />
            
            <InputField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a password"
              required
              error={errors.password?.[0]}
              validator={validatePassword}
              showPasswordRequirements={true}
              autoComplete="new-password"
            />
            
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword?.[0]}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
