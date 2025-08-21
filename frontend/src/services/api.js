import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login user
export async function loginUser(credentials) {
  try {
    const response = await api.post('/auth/login', credentials);
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    console.error('Login error:', error.response || error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during login'
    };
  }
}

// Register new user
export async function registerUser(userData) {
  try {
    const response = await api.post('/auth/register', userData);
    console.log('Registration response:', response);
    
    if (response.data && response.data.status === "success") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Registration failed'
      };
    }
  } catch (error) {
    console.error('Registration error:', error.response || error);
    
    // Handle specific error cases
    if (error.response?.status === 409) {
      return {
        success: false,
        message: 'Email already exists. Please use a different email address.'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during registration. Please try again.'
    };
  }
}

// Get protected route
export async function getProtected() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export default api;
