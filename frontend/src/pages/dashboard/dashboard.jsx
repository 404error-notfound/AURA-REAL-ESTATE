import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleNavigateToProperties = () => {
    navigate('/dashboard/properties');
  };

  const handleNavigateToLeads = () => {
    navigate('/dashboard/leads');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-[#001B48] text-white px-4 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-end items-center gap-3 lg:gap-6">
            <button className="px-4 py-2 bg-[#97CADB] text-[#001B48] rounded-lg hover:bg-[#87BADB] transition-colors font-medium">
              Overview
            </button>
            <button className="px-4 py-2 bg-transparent border border-[#97CADB] text-[#97CADB] rounded-lg hover:bg-[#97CADB] hover:text-[#001B48] transition-colors font-medium">
              Recent Properties
            </button>
            <button className="px-4 py-2 bg-transparent border border-[#97CADB] text-[#97CADB] rounded-lg hover:bg-[#97CADB] hover:text-[#001B48] transition-colors font-medium">
              Payments
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-black text-center">
            Welcome {user?.name || "User"} 👋
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          <div 
            onClick={handleNavigateToProperties}
            className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-[#018ABE] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏠</span>
              </div>
              <h3 className="text-black font-bold text-lg mb-2">Properties</h3>
              <p className="text-black text-2xl font-bold mb-1">12</p>
              <p className="text-black text-sm">Active Listings</p>
            </div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#97CADB] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[#001B48]">💰</span>
              </div>
              <h3 className="text-black font-bold text-lg mb-2">Transactions</h3>
              <p className="text-black text-2xl font-bold mb-1">5</p>
              <p className="text-black text-sm">Recent Payments</p>
            </div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#001B48] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-black font-bold text-lg mb-2">Users</h3>
              <p className="text-black text-2xl font-bold mb-1">34</p>
              <p className="text-black text-sm">Registered Users</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 lg:mt-12">
          <h2 className="text-xl lg:text-2xl font-bold text-black mb-6 text-center">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
            <button 
              onClick={handleNavigateToProperties}
              className="w-full sm:w-auto px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium"
            >
              Add Property
            </button>
            <button 
              onClick={handleNavigateToLeads}
              className="w-full sm:w-auto px-6 py-3 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors font-medium"
            >
              Submit Property Inquiry
            </button>
            <button className="w-full sm:w-auto px-6 py-3 border-2 border-[#018ABE] text-[#018ABE] rounded-lg hover:bg-[#018ABE] hover:text-white transition-colors font-medium">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
