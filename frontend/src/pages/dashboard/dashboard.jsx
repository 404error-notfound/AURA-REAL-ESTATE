import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/protected");
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, []);


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
      <div className="p-8 bg-extra-light min-h-screen">
      <h1 className="text-3xl font-bold text-primary-dark mb-6">
        Welcome {profile?.name || "User"} 👋
      </h1>
      {/* rest of dashboard cards */}
      </div>
      <div className="w-3/4 p-8 bg-extra-light min-h-screen">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Welcome Back 👋</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-primary font-bold text-lg">Properties</h3>
            <p className="text-gray-600">12 Active Listings</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-primary font-bold text-lg">Transactions</h3>
            <p className="text-gray-600">5 Recent Payments</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-primary font-bold text-lg">Users</h3>
            <p className="text-gray-600">34 Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
