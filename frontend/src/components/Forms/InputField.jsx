import React, { useState } from 'react';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  className = '',
  error,
  validator,
  showPasswordRequirements = false,
  disabled = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleBlur = (e) => {
    setFocused(false);
    
    // Run validation if validator is provided
    if (validator && value) {
      const result = validator(value);
      setValidationResult(result);
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const displayError = error || (validationResult && !validationResult.isValid ? validationResult.errors[0] : null);
  const isValid = !displayError && value && validationResult?.isValid;

  return (
    <div className="mb-4 flex flex-col items-center">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1 text-center"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full max-w-md">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            max-w-md mx-auto px-3 py-2 border rounded-md shadow-sm transition-colors text-center
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${displayError 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : isValid 
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        
        {/* Success indicator */}
        {isValid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {displayError && (
        <p className="mt-1 text-sm text-red-600 flex items-center justify-center text-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
      
      {/* Password requirements */}
      {showPasswordRequirements && type === 'password' && validationResult?.requirements && (focused || value) && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md max-w-md mx-auto">
          <p className="text-xs text-black mb-2 font-medium text-center">Password must contain:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className={`flex items-center justify-center ${validationResult.requirements.hasLength ? 'text-green-600' : 'text-black'}`}>
              <span className="mr-1">{validationResult.requirements.hasLength ? '✓' : '○'}</span>
              8+ characters
            </div>
            <div className={`flex items-center justify-center ${validationResult.requirements.hasUppercase ? 'text-green-600' : 'text-black'}`}>
              <span className="mr-1">{validationResult.requirements.hasUppercase ? '✓' : '○'}</span>
              Uppercase letter
            </div>
            <div className={`flex items-center justify-center ${validationResult.requirements.hasLowercase ? 'text-green-600' : 'text-black'}`}>
              <span className="mr-1">{validationResult.requirements.hasLowercase ? '✓' : '○'}</span>
              Lowercase letter
            </div>
            <div className={`flex items-center justify-center ${validationResult.requirements.hasNumber ? 'text-green-600' : 'text-black'}`}>
              <span className="mr-1">{validationResult.requirements.hasNumber ? '✓' : '○'}</span>
              Number
            </div>
            <div className={`flex items-center justify-center ${validationResult.requirements.hasSpecial ? 'text-green-600' : 'text-black'}`}>
              <span className="mr-1">{validationResult.requirements.hasSpecial ? '✓' : '○'}</span>
              Special character
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputField;
