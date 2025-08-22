// Email validation
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push("Email is required");
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }
  
  if (email.length > 120) {
    errors.push("Email must be less than 120 characters");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  const requirements = {
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  };
  
  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors, requirements };
  }
  
  // Check length
  if (password.length >= 8) {
    requirements.hasLength = true;
  } else {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }
  
  // Check for uppercase letter
  if (/[A-Z]/.test(password)) {
    requirements.hasUppercase = true;
  } else {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Check for lowercase letter
  if (/[a-z]/.test(password)) {
    requirements.hasLowercase = true;
  } else {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Check for number
  if (/\d/.test(password)) {
    requirements.hasNumber = true;
  } else {
    errors.push("Password must contain at least one number");
  }
  
  // Check for special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    requirements.hasSpecial = true;
  } else {
    errors.push("Password must contain at least one special character");
  }
  
  return { 
    isValid: errors.length === 0, 
    errors, 
    requirements 
  };
};

// Name validation
export const validateName = (name, fieldName = "Name") => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }
  
  if (trimmedName.length > 100) {
    errors.push(`${fieldName} must be less than 100 characters`);
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmedName)) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Phone validation
export const validatePhone = (phone) => {
  const errors = [];
  
  if (!phone) {
    return { isValid: true, errors }; // Phone is optional
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.push("Phone number must be between 10 and 15 digits");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Property validation
export const validateProperty = (data) => {
  const errors = [];
  
  // Required fields
  const requiredFields = [
    { key: 'title', label: 'Title' },
    { key: 'property_type', label: 'Property Type' },
    { key: 'price', label: 'Price' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zip_code', label: 'Zip Code' }
  ];
  
  requiredFields.forEach(field => {
    if (!data[field.key] || !data[field.key].toString().trim()) {
      errors.push(`${field.label} is required`);
    }
  });
  
  // Title validation
  if (data.title) {
    if (data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    }
    if (data.title.length > 200) {
      errors.push("Title must be less than 200 characters");
    }
  }
  
  // Price validation
  if (data.price) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
      errors.push("Price must be a valid positive number");
    }
    if (price > 999999999) {
      errors.push("Price is too high");
    }
  }
  
  // Address validation
  if (data.address && data.address.length > 255) {
    errors.push("Address must be less than 255 characters");
  }
  
  // City validation
  if (data.city) {
    if (data.city.length > 100) {
      errors.push("City must be less than 100 characters");
    }
    if (!/^[a-zA-Z\s\-'\.]+$/.test(data.city)) {
      errors.push("City can only contain letters, spaces, hyphens, and apostrophes");
    }
  }
  
  // State validation
  if (data.state && data.state.length > 100) {
    errors.push("State must be less than 100 characters");
  }
  
  // Zip code validation
  if (data.zip_code) {
    if (!/^[\d\-\s]+$/.test(data.zip_code)) {
      errors.push("Zip code can only contain numbers, hyphens, and spaces");
    }
    if (data.zip_code.length > 20) {
      errors.push("Zip code must be less than 20 characters");
    }
  }
  
  // Optional numeric fields validation
  const numericFields = [
    { key: 'bedrooms', label: 'Bedrooms', max: 50 },
    { key: 'bathrooms', label: 'Bathrooms', max: 20 },
    { key: 'square_feet', label: 'Square Feet', max: 999999 },
    { key: 'lot_size', label: 'Lot Size', max: 999999 },
    { key: 'year_built', label: 'Year Built', min: 1800, max: 2030 },
    { key: 'parking_spaces', label: 'Parking Spaces', max: 50 }
  ];
  
  numericFields.forEach(field => {
    if (data[field.key] !== undefined && data[field.key] !== '') {
      const value = parseFloat(data[field.key]);
      if (isNaN(value) || value < 0) {
        errors.push(`${field.label} must be a valid positive number`);
      } else {
        if (field.min && value < field.min) {
          errors.push(`${field.label} must be at least ${field.min}`);
        }
        if (field.max && value > field.max) {
          errors.push(`${field.label} cannot exceed ${field.max}`);
        }
      }
    }
  });
  
  return { isValid: errors.length === 0, errors };
};

// Lead validation
export const validateLead = (data) => {
  const errors = [];
  
  // Budget validation
  if (data.budget_min && data.budget_max) {
    const budgetMin = parseFloat(data.budget_min);
    const budgetMax = parseFloat(data.budget_max);
    
    if (isNaN(budgetMin) || isNaN(budgetMax)) {
      errors.push("Budget values must be valid numbers");
    } else {
      if (budgetMin < 0 || budgetMax < 0) {
        errors.push("Budget values cannot be negative");
      }
      if (budgetMin > budgetMax) {
        errors.push("Minimum budget cannot be greater than maximum budget");
      }
    }
  }
  
  // Contact preferences validation
  const validContactMethods = ['email', 'phone', 'text', 'any'];
  if (data.preferred_contact && !validContactMethods.includes(data.preferred_contact)) {
    errors.push("Invalid contact preference");
  }
  
  const validContactTimes = ['morning', 'afternoon', 'evening', 'any'];
  if (data.preferred_contact_time && !validContactTimes.includes(data.preferred_contact_time)) {
    errors.push("Invalid contact time preference");
  }
  
  return { isValid: errors.length === 0, errors };
};

// Generic form validation
export const validateForm = (data, validators) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validators).forEach(field => {
    const validator = validators[field];
    const result = validator(data[field]);
    
    if (!result.isValid) {
      errors[field] = result.errors;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Helper to display errors
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.join('. ');
  }
  
  if (typeof errors === 'object') {
    const allErrors = [];
    Object.values(errors).forEach(fieldErrors => {
      if (Array.isArray(fieldErrors)) {
        allErrors.push(...fieldErrors);
      } else {
        allErrors.push(fieldErrors);
      }
    });
    return allErrors.join('. ');
  }
  
  return errors.toString();
};

// Legacy validators for backward compatibility
export const isValidEmail = (email) => validateEmail(email).isValid;
export const isValidPassword = (password) => validatePassword(password).isValid;
export const isValidName = (name) => validateName(name).isValid;
