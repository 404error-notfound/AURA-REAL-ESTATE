import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import PropertyForm from "../../components/Forms/PropertyForm";
import PropertyCard from "../../components/PropertyCard";

export default function Properties() {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingProperties, setFetchingProperties] = useState(true);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setFetchingProperties(true);
      console.log('Fetching properties from API...');
      
      // Try with token first, but also allow without token since GET /properties is public
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/properties/', {
        method: 'GET',
        headers: headers
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('API Response data:', result);
        
        if (result.status === 'success') {
          setProperties(result.data || []);
          console.log('Properties set:', result.data || []);
        } else {
          console.error('Failed to fetch properties:', result.message);
          alert(`Failed to fetch properties: ${result.message}`);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch properties:', response.statusText, errorText);
        alert(`Failed to fetch properties: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert(`Error fetching properties: ${error.message}`);
    } finally {
      setFetchingProperties(false);
    }
  };

  const handleAddProperty = async (propertyData) => {
    try {
      setIsLoading(true);
      console.log('Starting property submission with data:', propertyData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add properties');
        return;
      }
      console.log('Token found:', token ? 'Yes' : 'No');
      
      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      // Check if there are images to upload
      if (propertyData.images && propertyData.images.length > 0) {
        console.log('Processing form with images:', propertyData.images.length);
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Add all property data except images
        Object.keys(propertyData).forEach(key => {
          if (key !== 'images' && propertyData[key] !== null && propertyData[key] !== '') {
            formData.append(key, propertyData[key]);
            console.log(`Added field ${key}:`, propertyData[key]);
          }
        });
        
        // Add images
        propertyData.images.forEach((image, index) => {
          formData.append('images', image);
          console.log(`Added image ${index}:`, image.name);
        });
        
        requestBody = formData;
        // Don't set Content-Type header for FormData (let browser set it with boundary)
      } else {
        console.log('Processing form without images');
        // Use JSON for data without images
        headers['Content-Type'] = 'application/json';
        const { images, ...dataWithoutImages } = propertyData;
        requestBody = JSON.stringify(dataWithoutImages);
        console.log('JSON body:', dataWithoutImages);
      }

      console.log('Making request to:', 'http://localhost:5000/api/properties/');
      const response = await fetch('http://localhost:5000/api/properties/', {
        method: 'POST',
        headers: headers,
        body: requestBody
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        if (result.status === 'success') {
          // Refresh the properties list
          await fetchProperties();
          setShowForm(false);
          alert('Property added successfully!');
        } else {
          throw new Error(result.message || 'Failed to add property');
        }
      } else {
        const errorResult = await response.text();
        console.error('Error response body:', errorResult);
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorResult);
          errorMessage = parsedError.message || parsedError.error || 'Failed to add property';
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert(`Error adding property: ${error.message}`);
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
        <PropertyForm 
          onSubmit={handleAddProperty}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 lg:mb-8 gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-black">Properties</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full lg:w-auto px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium"
        >
          Add New Property
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="w-full lg:flex-1">
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center lg:text-left transition-colors"
            />
          </div>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
            <select className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors">
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
            </select>
            <select className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] text-center transition-colors">
              <option value="">Price Range</option>
              <option value="0-500000">$0 - $500k</option>
              <option value="500000-1000000">$500k - $1M</option>
              <option value="1000000+">$1M+</option>
            </select>
            <button className="w-full sm:w-auto px-6 py-3 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors font-medium">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {fetchingProperties ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-2xl shadow animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : properties.length > 0 ? (
          // Actual properties
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          // No properties message
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first property listing.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium"
              >
                Add Your First Property
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
