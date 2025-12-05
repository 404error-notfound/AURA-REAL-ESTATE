import { useState, useEffect } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

const PROPERTY_TYPES = [
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condominium', label: 'Condominium' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'retail', label: 'Retail' },
  { value: 'shopping_centre', label: 'Shopping Centre' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'factory', label: 'Factory' },
  { value: 'farmland', label: 'Farmland' },
  { value: 'raw_land', label: 'Raw Land' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'withdrawn', label: 'Withdrawn' }
];

export default function PropertyForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    property_type: initialData?.property_type || '',
    price: initialData?.price || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip_code: initialData?.zip_code || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    square_feet: initialData?.square_feet || '',
    lot_size: initialData?.lot_size || '',
    year_built: initialData?.year_built || '',
    parking_spaces: initialData?.parking_spaces || '',
    status: initialData?.status || 'active',
    is_featured: initialData?.is_featured || false,
    features: initialData?.features || '',
    amenities: initialData?.amenities || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreview.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert numeric inputs to appropriate types immediately
    let processedValue = value;
    if (type === 'number' && value !== '') {
      // For price field, parse as float to handle decimal values
      if (name === 'price') {
        processedValue = parseFloat(value) || 0;
      }
      // For integer fields, parse as int
      else if (['bedrooms', 'year_built', 'parking_spaces'].includes(name)) {
        processedValue = parseInt(value) || 0;
      }
      // For other numeric fields that can have decimals
      else {
        processedValue = parseFloat(value) || 0;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({
        ...prev,
        images: 'Please select only image files (JPEG, PNG, WebP)'
      }));
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = validFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Each image must be less than 5MB'
      }));
      return;
    }

    // Clear any previous image errors
    setErrors(prev => ({
      ...prev,
      images: ''
    }));

    // Add new files to existing images
    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      // Revoke the URL to prevent memory leaks
      if (prev[index]?.url) {
        URL.revokeObjectURL(prev[index].url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.property_type) newErrors.property_type = 'Property type is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';

    // Numeric validations - these fields should already be numbers
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    if (formData.bedrooms && (isNaN(formData.bedrooms) || formData.bedrooms < 0)) {
      newErrors.bedrooms = 'Bedrooms must be a positive number';
    }
    if (formData.bathrooms && (isNaN(formData.bathrooms) || formData.bathrooms < 0)) {
      newErrors.bathrooms = 'Bathrooms must be a positive number';
    }
    if (formData.square_feet && (isNaN(formData.square_feet) || formData.square_feet <= 0)) {
      newErrors.square_feet = 'Square feet must be a positive number';
    }
    if (formData.year_built && (isNaN(formData.year_built) || formData.year_built < 1800 || formData.year_built > new Date().getFullYear())) {
      newErrors.year_built = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Data is already in the correct format, just add images
      const processedData = {
        ...formData,
        images: images // Include uploaded images
      };

      await onSubmit(processedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'An error occurred while saving the property' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 max-w-4xl">
      <h2 className="text-xl lg:text-2xl font-bold text-[#001B48] mb-4 text-left">
        {initialData ? 'Edit Property' : 'Add New Property'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3">
            <InputField
              label="Property Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              placeholder="Enter property title"
              required
            />
          </div>

          <SelectField
            label="Property Type"
            name="property_type"
            value={formData.property_type}
            onChange={(e) => handleInputChange(e)}
            options={PROPERTY_TYPES}
            error={errors.property_type}
            placeholder="Select property type"
            required
          />

          <InputField
            label="Price ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter property description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] transition-colors resize-none text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Location Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#001B48] mb-3">Location Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                placeholder="Enter street address"
                required
              />
            </div>

            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              placeholder="Enter city"
              required
            />

            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              error={errors.state}
              placeholder="Enter state"
              required
            />

            <InputField
              label="ZIP Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              error={errors.zip_code}
              placeholder="Enter ZIP code"
              required
            />

            <div></div>

            <InputField
              label="Latitude (Optional)"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleInputChange}
              error={errors.latitude}
              placeholder="Enter latitude"
            />

            <InputField
              label="Longitude (Optional)"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleInputChange}
              error={errors.longitude}
              placeholder="Enter longitude"
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#001B48] mb-3">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={handleInputChange}
              error={errors.bedrooms}
              placeholder="Number of bedrooms"
            />

            <InputField
              label="Bathrooms"
              name="bathrooms"
              type="number"
              step="0.5"
              min="0"
              value={formData.bathrooms}
              onChange={handleInputChange}
              error={errors.bathrooms}
              placeholder="Number of bathrooms"
            />

            <InputField
              label="Square Feet"
              name="square_feet"
              type="number"
              min="0"
              value={formData.square_feet}
              onChange={handleInputChange}
              error={errors.square_feet}
              placeholder="Total square feet"
            />

            <InputField
              label="Lot Size (sq ft)"
              name="lot_size"
              type="number"
              min="0"
              value={formData.lot_size}
              onChange={handleInputChange}
              error={errors.lot_size}
              placeholder="Lot size"
            />

            <InputField
              label="Year Built"
              name="year_built"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.year_built}
              onChange={handleInputChange}
              error={errors.year_built}
              placeholder="Year built"
            />

            <InputField
              label="Parking Spaces"
              name="parking_spaces"
              type="number"
              min="0"
              value={formData.parking_spaces}
              onChange={handleInputChange}
              error={errors.parking_spaces}
              placeholder="Number of parking spaces"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#001B48] mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={STATUS_OPTIONS}
              error={errors.status}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="mr-3 h-4 w-4 text-[#018ABE] focus:ring-[#018ABE] border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                Featured Property
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features (comma-separated)
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Hardwood floors, Updated kitchen, Fireplace"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] transition-colors resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities (comma-separated)
              </label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="e.g., Pool, Gym, Concierge, Balcony"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] transition-colors resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-[#001B48] mb-3">Property Images</h3>
          
          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#018ABE] transition-colors">
              <input
                type="file"
                id="property-images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Upload prompt - show only when no images */}
              {imagePreview.length === 0 && (
                <label
                  htmlFor="property-images"
                  className="cursor-pointer flex flex-col items-center text-center"
                >
                  <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600 mb-1">
                    Click to upload images
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, WebP up to 5MB each
                  </span>
                </label>
              )}

              {/* Image Preview inside the dashed box */}
              {imagePreview.length > 0 && (
                <div className="space-y-4">
                  {/* Add more images button */}
                  <div className="text-center">
                    <label
                      htmlFor="property-images"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add more images
                    </label>
                  </div>
                  
                  {/* Images grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.url}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{preview.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {errors.images && (
              <p className="text-red-600 text-sm mt-2">{errors.images}</p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-[#018ABE] text-[#018ABE] rounded-lg hover:bg-[#018ABE] hover:text-white transition-colors font-medium disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>
    </div>
  );
}
