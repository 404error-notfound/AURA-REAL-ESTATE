import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.clear();
      // Force reload and redirect
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4">
        <div className="bg-primary text-white h-screen p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <ul className="space-y-4">
            <li className="hover:text-accent cursor-pointer">Overview</li>
            <li className="hover:text-accent cursor-pointer">Recent Properties</li>
            <li className="hover:text-accent cursor-pointer">Payments</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#001B48]">
            Welcome {user?.name || "User"} 👋
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <h3 className="text-[#001B48] font-bold text-lg">Properties</h3>
            <p className="text-gray-600">12 Active Listings</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <h3 className="text-[#001B48] font-bold text-lg">Transactions</h3>
            <p className="text-gray-600">5 Recent Payments</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <h3 className="text-[#001B48] font-bold text-lg">Users</h3>
            <p className="text-gray-600">34 Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
