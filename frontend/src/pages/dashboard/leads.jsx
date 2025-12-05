import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import LeadForm from '../../components/Forms/LeadForm';

export default function Leads() {
  const { user } = useContext(AuthContext);
  const isClient = user?.user_type === 'client';
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLead = async (leadData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(leadData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setLeads(prev => [result.data, ...prev]);
          setShowForm(false);
          alert('Lead added successfully!');
        } else {
          throw new Error(result.message || 'Failed to add lead');
        }
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Failed to add lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert(`Error adding lead: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="p-4 lg:p-8">
        <LeadForm 
          onSubmit={handleAddLead}
          onCancel={handleCancelForm}
          users={[]} // TODO: Fetch users from API
          properties={[]} // TODO: Fetch properties from API
        />
      </div>
    );
  }
  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-black">
          {isClient ? 'My Property Inquiries' : 'Leads'}
        </h1>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full lg:w-auto px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium"
        >
          {isClient ? 'Submit New Inquiry' : 'Add New Lead'}
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="w-full lg:flex-1 flex justify-center">
            <input
              type="text"
              placeholder="Search leads by name or email..."
              className="max-w-md w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors"
            />
          </div>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select className="max-w-xs w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors">
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
              <h3 className="font-bold text-black">Sarah Johnson</h3>
              <p className="text-sm text-black">Looking for: 3BR Apartment</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              New
            </span>
          </div>
          <p className="text-black mb-2">sarah.johnson@email.com</p>
          <p className="text-black mb-2">Budget: $300,000 - $450,000</p>
          <p className="text-sm text-black mb-3">Contacted: 2 hours ago</p>
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
              <h3 className="font-bold text-black">Mike Chen</h3>
              <p className="text-sm text-black">Looking for: Office Space</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              In Progress
            </span>
          </div>
          <p className="text-black mb-2">mike.chen@business.com</p>
          <p className="text-black mb-2">Budget: $800,000 - $1,200,000</p>
          <p className="text-sm text-black mb-3">Contacted: 1 day ago</p>
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
              <h3 className="font-bold text-black">Emily Rodriguez</h3>
              <p className="text-sm text-black">Looking for: Family House</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Qualified
            </span>
          </div>
          <p className="text-black mb-2">emily.r@email.com</p>
          <p className="text-black mb-2">Budget: $500,000 - $750,000</p>
          <p className="text-sm text-black mb-3">Contacted: 3 days ago</p>
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
                <th className="text-left text-black font-bold px-6 py-4">Name</th>
                <th className="text-left text-black font-bold px-6 py-4">Email</th>
                <th className="text-left text-black font-bold px-6 py-4">Interest</th>
                <th className="text-left text-black font-bold px-6 py-4">Budget</th>
                <th className="text-left text-black font-bold px-6 py-4">Status</th>
                <th className="text-left text-black font-bold px-6 py-4">Last Contact</th>
                <th className="text-left text-black font-bold px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-black">Sarah Johnson</td>
                <td className="px-6 py-4 text-black">sarah.johnson@email.com</td>
                <td className="px-6 py-4 text-black">3BR Apartment</td>
                <td className="px-6 py-4 text-black">$300K - $450K</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    New
                  </span>
                </td>
                <td className="px-6 py-4 text-black">2 hours ago</td>
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
                <td className="px-6 py-4 font-medium text-black">Mike Chen</td>
                <td className="px-6 py-4 text-black">mike.chen@business.com</td>
                <td className="px-6 py-4 text-black">Office Space</td>
                <td className="px-6 py-4 text-black">$800K - $1.2M</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    In Progress
                  </span>
                </td>
                <td className="px-6 py-4 text-black">1 day ago</td>
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
                <td className="px-6 py-4 font-medium text-black">Emily Rodriguez</td>
                <td className="px-6 py-4 text-black">emily.r@email.com</td>
                <td className="px-6 py-4 text-black">Family House</td>
                <td className="px-6 py-4 text-black">$500K - $750K</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Qualified
                  </span>
                </td>
                <td className="px-6 py-4 text-black">3 days ago</td>
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