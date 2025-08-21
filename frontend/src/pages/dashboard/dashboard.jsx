import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile-responsive Sidebar */}
      <div className="w-full lg:w-1/4">
        <div className="bg-[#001B48] text-white p-4 lg:p-6 lg:h-screen">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Dashboard</h2>
          <ul className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 overflow-x-auto lg:overflow-x-visible">
            <li className="hover:text-[#97CADB] cursor-pointer whitespace-nowrap">Overview</li>
            <li className="hover:text-[#97CADB] cursor-pointer whitespace-nowrap">Recent Properties</li>
            <li className="hover:text-[#97CADB] cursor-pointer whitespace-nowrap">Payments</li>
            <li className="hover:text-[#97CADB] cursor-pointer whitespace-nowrap lg:hidden">
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-3/4 p-4 lg:p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#001B48]">
            Welcome {user?.name || "User"} 👋
          </h1>
          <button
            onClick={handleLogout}
            className="hidden lg:block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <h3 className="text-[#001B48] font-bold text-lg">Properties</h3>
            <p className="text-gray-600">12 Active Listings</p>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
            <h3 className="text-[#001B48] font-bold text-lg">Transactions</h3>
            <p className="text-gray-600">5 Recent Payments</p>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <h3 className="text-[#001B48] font-bold text-lg">Users</h3>
            <p className="text-gray-600">34 Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
