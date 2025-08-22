import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Clients() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#001B48]">Clients</h1>
        <button className="w-full lg:w-auto px-4 py-2 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors">
          Add New Client
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {/* Sample client cards for mobile */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-[#001B48]">John Doe</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Active
            </span>
          </div>
          <p className="text-gray-600 mb-2">john@example.com</p>
          <p className="text-gray-600 mb-3">+1 234 567 8901</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              Contact
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-[#001B48]">Jane Smith</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Pending
            </span>
          </div>
          <p className="text-gray-600 mb-2">jane@example.com</p>
          <p className="text-gray-600 mb-3">+1 234 567 8902</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Name</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Email</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Phone</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Status</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Sample client data - Replace with real data */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">John Doe</td>
                <td className="px-6 py-4 text-gray-600">john@example.com</td>
                <td className="px-6 py-4 text-gray-600">+1 234 567 8901</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#001B48] text-white rounded hover:bg-[#002B6D] transition-colors text-sm">
                      View
                    </button>
                    <button className="px-3 py-1 border border-[#001B48] text-[#001B48] rounded hover:bg-[#001B48] hover:text-white transition-colors text-sm">
                      Contact
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Jane Smith</td>
                <td className="px-6 py-4 text-gray-600">jane@example.com</td>
                <td className="px-6 py-4 text-gray-600">+1 234 567 8902</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#001B48] text-white rounded hover:bg-[#002B6D] transition-colors text-sm">
                      View
                    </button>
                    <button className="px-3 py-1 border border-[#001B48] text-[#001B48] rounded hover:bg-[#001B48] hover:text-white transition-colors text-sm">
                      Contact
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
