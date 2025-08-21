const API_URL = "http://127.0.0.1:5000/api/auth"; // Flask runs on port 5000 by default

// Register new user
export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
}

// Login user
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

// Get protected route
export async function getProtected(token) {
  const res = await fetch(`${API_URL}/protected`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
