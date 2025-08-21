const API_URL = "http://localhost:5000/api/auth"; // Flask runs on port 5000 by default

// Register new user
export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'An error occurred during registration' 
    };
  }
}

// Login user
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during login'
    };
  }
}

// Get protected route
export async function getProtected(token) {
  const res = await fetch(`${API_URL}/protected`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
