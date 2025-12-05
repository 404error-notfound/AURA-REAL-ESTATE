import React from 'react';

export default function PropertyCard({ property }) {
  // Helper function to get the primary image URL
  const getPrimaryImageUrl = () => {
    if (property?.images && property.images.length > 0) {
      const primaryImage = property.images.find(img => img.is_primary) || property.images[0];
      // Construct full URL for image
      return `http://localhost:5000${primaryImage.image_url}`;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Property Image */}
      <div className="relative aspect-video bg-gray-200">
        {getPrimaryImageUrl() ? (
          <img 
            src={getPrimaryImageUrl()} 
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center ${getPrimaryImageUrl() ? 'hidden' : 'flex'}`}
        >
          <span className="text-gray-500">No Image Available</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#018ABE] text-white rounded-full text-sm font-medium">
            {property?.status || 'Available'}
          </span>
        </div>
        {property?.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 lg:p-6">
        <div className="mb-3">
          <h3 className="text-lg lg:text-xl font-bold text-[#001B48] mb-1 line-clamp-1">
            {property?.title || 'Property Title'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {property?.address || 'Property Address'}, {property?.city || 'City'}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-2xl lg:text-3xl font-bold text-[#018ABE]">
            ${property?.price?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {property?.property_type || 'Property Type'}
          </p>
        </div>

        {/* Property Features */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          {property?.bedrooms && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property?.bathrooms && (
            <span className="flex items-center gap-1">
              🚿 {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
            </span>
          )}
          {property?.square_feet && (
            <span className="flex items-center gap-1">
              📐 {property.square_feet.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex-1 px-4 py-2 bg-[#001B48] text-white rounded-lg hover:bg-[#002B6D] transition-colors font-medium">
            View Details
          </button>
          <button className="flex-1 px-4 py-2 border-2 border-[#001B48] text-[#001B48] rounded-lg hover:bg-[#001B48] hover:text-white transition-colors font-medium">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}
