const API_URL = "http://127.0.0.1:5000/api/auth"; // Flask runs on port 5000 by default

// Register new user
export async function registerUser(userData) {
  try {
    console.log('Sending registration request to:', `${API_URL}/register`);
    console.log('Registration data:', userData);
    
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    }).catch(error => {
      console.error('Fetch error:', error);
      throw new Error('Network error: Unable to connect to the server');
    });
    
    console.log('Registration response status:', res.status);
    
    const data = await res.json();
    console.log('Registration response data:', data);
    
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
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
