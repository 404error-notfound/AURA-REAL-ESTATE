import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Properties() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#001B48]">Properties</h1>
        <button className="w-full lg:w-auto px-4 py-2 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors">
          Add New Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Sample Property Cards - Replace with real data */}
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Property Image</span>
          </div>
          <h3 className="text-[#001B48] font-bold text-lg mb-2">Luxury Villa</h3>
          <p className="text-2xl font-bold text-[#018ABE] mb-2">$1,200,000</p>
          <p className="text-gray-500 mb-3">4 beds • 3 baths • 2,500 sqft</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              Edit
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Property Image</span>
          </div>
          <h3 className="text-[#001B48] font-bold text-lg mb-2">Modern Apartment</h3>
          <p className="text-2xl font-bold text-[#018ABE] mb-2">$450,000</p>
          <p className="text-gray-500 mb-3">2 beds • 2 baths • 1,200 sqft</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              Edit
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">Property Image</span>
          </div>
          <h3 className="text-[#001B48] font-bold text-lg mb-2">Beachfront Condo</h3>
          <p className="text-2xl font-bold text-[#018ABE] mb-2">$850,000</p>
          <p className="text-gray-500 mb-3">3 beds • 2 baths • 1,800 sqft</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 px-3 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors text-sm">
              View Details
            </button>
            <button className="flex-1 px-3 py-2 border border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors text-sm">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
