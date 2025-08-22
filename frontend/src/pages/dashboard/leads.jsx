import React from 'react';

export default function Leads() {
  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#001B48]">Leads</h1>
        <button className="w-full lg:w-auto px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium">
          Add New Lead
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="w-full lg:flex-1">
            <input
              type="text"
              placeholder="Search leads by name or email..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center lg:text-left transition-colors"
            />
          </div>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
            <select className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors">
              <option value="">Lead Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in-progress">In Progress</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
            <select className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors">
              <option value="">Budget Range</option>
              <option value="0-300000">$0 - $300k</option>
              <option value="300000-500000">$300k - $500k</option>
              <option value="500000-1000000">$500k - $1M</option>
              <option value="1000000+">$1M+</option>
            </select>
            <button className="w-full sm:w-auto px-6 py-3 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors font-medium">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {/* Sample lead cards for mobile */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-[#001B48]">Sarah Johnson</h3>
              <p className="text-sm text-gray-600">Looking for: 3BR Apartment</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              New
            </span>
          </div>
          <p className="text-gray-600 mb-2">sarah.johnson@email.com</p>
          <p className="text-gray-600 mb-2">Budget: $300,000 - $450,000</p>
          <p className="text-sm text-gray-500 mb-3">Contacted: 2 hours ago</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              Contact
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-[#001B48]">Mike Chen</h3>
              <p className="text-sm text-gray-600">Looking for: Office Space</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              In Progress
            </span>
          </div>
          <p className="text-gray-600 mb-2">mike.chen@business.com</p>
          <p className="text-gray-600 mb-2">Budget: $800,000 - $1,200,000</p>
          <p className="text-sm text-gray-500 mb-3">Contacted: 1 day ago</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              Contact
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-[#001B48]">Emily Rodriguez</h3>
              <p className="text-sm text-gray-600">Looking for: Family House</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Qualified
            </span>
          </div>
          <p className="text-gray-600 mb-2">emily.r@email.com</p>
          <p className="text-gray-600 mb-2">Budget: $500,000 - $750,000</p>
          <p className="text-sm text-gray-500 mb-3">Contacted: 3 days ago</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              Contact
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              View Details
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
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Interest</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Budget</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Status</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Last Contact</th>
                <th className="text-left text-[#001B48] font-bold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Sarah Johnson</td>
                <td className="px-6 py-4 text-gray-600">sarah.johnson@email.com</td>
                <td className="px-6 py-4 text-gray-600">3BR Apartment</td>
                <td className="px-6 py-4 text-gray-600">$300K - $450K</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    New
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">2 hours ago</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#001B48] text-white rounded hover:bg-[#002B6D] transition-colors text-sm">
                      Contact
                    </button>
                    <button className="px-3 py-1 border border-[#001B48] text-[#001B48] rounded hover:bg-[#001B48] hover:text-white transition-colors text-sm">
                      View
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Mike Chen</td>
                <td className="px-6 py-4 text-gray-600">mike.chen@business.com</td>
                <td className="px-6 py-4 text-gray-600">Office Space</td>
                <td className="px-6 py-4 text-gray-600">$800K - $1.2M</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">1 day ago</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#001B48] text-white rounded hover:bg-[#002B6D] transition-colors text-sm">
                      Contact
                    </button>
                    <button className="px-3 py-1 border border-[#001B48] text-[#001B48] rounded hover:bg-[#001B48] hover:text-white transition-colors text-sm">
                      View
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">Emily Rodriguez</td>
                <td className="px-6 py-4 text-gray-600">emily.r@email.com</td>
                <td className="px-6 py-4 text-gray-600">Family House</td>
                <td className="px-6 py-4 text-gray-600">$500K - $750K</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Qualified
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">3 days ago</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-[#001B48] text-white rounded hover:bg-[#002B6D] transition-colors text-sm">
                      Contact
                    </button>
                    <button className="px-3 py-1 border border-[#001B48] text-[#001B48] rounded hover:bg-[#001B48] hover:text-white transition-colors text-sm">
                      View
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