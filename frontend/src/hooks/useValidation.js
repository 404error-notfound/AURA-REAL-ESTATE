import { useState, useCallback } from 'react';

export const useValidation = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback((fieldName, value, validator) => {
    const result = validator(value);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? null : result.errors
    }));
    
    return result;
  }, []);

  const validateForm = useCallback((data, validators) => {
    setIsValidating(true);
    const formErrors = {};
    let isValid = true;

    Object.keys(validators).forEach(field => {
      const validator = validators[field];
      const result = validator(data[field]);
      
      if (!result.isValid) {
        formErrors[field] = result.errors;
        isValid = false;
      }
    });

    setErrors(formErrors);
    setIsValidating(false);
    
    return { isValid, errors: formErrors };
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: null
    }));
  }, []);

  const hasErrors = Object.values(errors).some(error => error && error.length > 0);

  return {
    errors,
    isValidating,
    hasErrors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setErrors
  };
};
