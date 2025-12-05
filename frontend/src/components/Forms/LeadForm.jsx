import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import InputField from './InputField';
import SelectField from './SelectField';

const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' }
];

const CONTACT_PREFERENCES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text Message' },
  { value: 'any', label: 'Any Method' }
];

const CONTACT_TIME_PREFERENCES = [
  { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 8 PM)' },
  { value: 'any', label: 'Any Time' }
];

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

const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' }
];

export default function LeadForm({ onSubmit, onCancel, initialData = null, users = [], properties = [] }) {
  const { user } = useContext(AuthContext);
  const isClient = user?.user_type === 'client';
  
  const [formData, setFormData] = useState({
    user_id: initialData?.user_id || (isClient ? user?.id : ''),
    property_id: initialData?.property_id || '',
    assigned_agent_id: initialData?.assigned_agent_id || '',
    status: initialData?.status || 'new',
    source: initialData?.source || '',
    notes: initialData?.notes || '',
    budget_min: initialData?.budget_min || '',
    budget_max: initialData?.budget_max || '',
    preferred_contact: initialData?.preferred_contact || '',
    preferred_contact_time: initialData?.preferred_contact_time || '',
    desired_location: initialData?.desired_location || '',
    desired_property_type: initialData?.desired_property_type || '',
    desired_bedrooms: initialData?.desired_bedrooms || '',
    desired_bathrooms: initialData?.desired_bathrooms || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // For agents, user_id is required. For clients, it's automatic
    if (!isClient && !formData.user_id) {
      newErrors.user_id = 'Client is required';
    }

    // Budget validation
    if (formData.budget_min && formData.budget_max) {
      const minBudget = parseFloat(formData.budget_min);
      const maxBudget = parseFloat(formData.budget_max);
      
      if (isNaN(minBudget) || isNaN(maxBudget)) {
        newErrors.budget_min = 'Budget values must be valid numbers';
      } else if (minBudget > maxBudget) {
        newErrors.budget_min = 'Minimum budget cannot be greater than maximum budget';
      } else if (minBudget < 0 || maxBudget < 0) {
        newErrors.budget_min = 'Budget values cannot be negative';
      }
    }

    // Numeric validations
    if (formData.desired_bedrooms && (isNaN(formData.desired_bedrooms) || formData.desired_bedrooms < 0)) {
      newErrors.desired_bedrooms = 'Bedrooms must be a positive number';
    }
    if (formData.desired_bathrooms && (isNaN(formData.desired_bathrooms) || formData.desired_bathrooms < 0)) {
      newErrors.desired_bathrooms = 'Bathrooms must be a positive number';
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
      // Convert string numbers to actual numbers
      const processedData = {
        ...formData,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        desired_bedrooms: formData.desired_bedrooms ? parseInt(formData.desired_bedrooms) : null,
        desired_bathrooms: formData.desired_bathrooms ? parseFloat(formData.desired_bathrooms) : null,
        user_id: parseInt(formData.user_id),
        property_id: formData.property_id ? parseInt(formData.property_id) : null,
        assigned_agent_id: formData.assigned_agent_id ? parseInt(formData.assigned_agent_id) : null
      };

      await onSubmit(processedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'An error occurred while saving the lead' });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert users and properties arrays to select options
  const userOptions = users.map(user => ({
    value: user.id.toString(),
    label: `${user.name} (${user.email})`
  }));

  const agentOptions = users
    .filter(user => user.user_type === 'agent')
    .map(agent => ({
      value: agent.id.toString(),
      label: `${agent.name} (${agent.email})`
    }));

  const propertyOptions = properties.map(property => ({
    value: property.id.toString(),
    label: `${property.title} - ${property.address}`
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6 text-center">
        {isClient ? 
          (initialData ? 'Edit Your Property Inquiry' : 'Submit Property Inquiry') :
          (initialData ? 'Edit Lead' : 'Add New Lead')
        }
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!isClient && (
            <SelectField
              label="Client"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              options={userOptions}
              error={errors.user_id}
              placeholder="Select a client"
              required
            />
          )}

          <SelectField
            label="Interested Property (Optional)"
            name="property_id"
            value={formData.property_id}
            onChange={handleInputChange}
            options={propertyOptions}
            error={errors.property_id}
            placeholder="Select a property (optional)"
          />

          {!isClient && (
            <SelectField
              label="Assigned Agent (Optional)"
              name="assigned_agent_id"
              value={formData.assigned_agent_id}
              onChange={handleInputChange}
              options={agentOptions}
              error={errors.assigned_agent_id}
              placeholder="Select an agent (optional)"
            />
          )}

          {!isClient && (
            <SelectField
              label="Lead Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={LEAD_STATUSES}
              error={errors.status}
            />
          )}

          <SelectField
            label={isClient ? "How did you hear about us?" : "Lead Source"}
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            options={LEAD_SOURCES}
            error={errors.source}
            placeholder={isClient ? "How did you find us?" : "Select lead source"}
          />
        </div>

        {/* Budget Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {isClient ? 'Your Budget Range' : 'Budget Information'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputField
              label="Minimum Budget ($)"
              name="budget_min"
              type="number"
              min="0"
              value={formData.budget_min}
              onChange={handleInputChange}
              error={errors.budget_min}
              placeholder="Enter minimum budget"
            />

            <InputField
              label="Maximum Budget ($)"
              name="budget_max"
              type="number"
              min="0"
              value={formData.budget_max}
              onChange={handleInputChange}
              error={errors.budget_max}
              placeholder="Enter maximum budget"
            />
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {isClient ? 'How would you like us to contact you?' : 'Contact Preferences'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectField
              label="Preferred Contact Method"
              name="preferred_contact"
              value={formData.preferred_contact}
              onChange={handleInputChange}
              options={CONTACT_PREFERENCES}
              error={errors.preferred_contact}
              placeholder="Select contact method"
            />

            <SelectField
              label="Best Time to Contact"
              name="preferred_contact_time"
              value={formData.preferred_contact_time}
              onChange={handleInputChange}
              options={CONTACT_TIME_PREFERENCES}
              error={errors.preferred_contact_time}
              placeholder="Select best time"
            />
          </div>
        </div>

        {/* Property Requirements */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {isClient ? 'What are you looking for?' : 'Property Requirements'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <InputField
                label={isClient ? "Preferred Location/Area" : "Desired Location"}
                name="desired_location"
                value={formData.desired_location}
                onChange={handleInputChange}
                error={errors.desired_location}
                placeholder={isClient ? "e.g., Downtown, Westside, Near schools" : "Enter desired location/area"}
              />
            </div>

            <SelectField
              label={isClient ? "Property Type You're Interested In" : "Desired Property Type"}
              name="desired_property_type"
              value={formData.desired_property_type}
              onChange={handleInputChange}
              options={PROPERTY_TYPES}
              error={errors.desired_property_type}
              placeholder="Select property type"
            />

            <div></div>

            <InputField
              label={isClient ? "Number of Bedrooms" : "Desired Bedrooms"}
              name="desired_bedrooms"
              type="number"
              min="0"
              value={formData.desired_bedrooms}
              onChange={handleInputChange}
              error={errors.desired_bedrooms}
              placeholder="Number of bedrooms"
            />

            <InputField
              label={isClient ? "Number of Bathrooms" : "Desired Bathrooms"}
              name="desired_bathrooms"
              type="number"
              step="0.5"
              min="0"
              value={formData.desired_bathrooms}
              onChange={handleInputChange}
              error={errors.desired_bathrooms}
              placeholder="Number of bathrooms"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            {isClient ? 'Additional Details' : 'Additional Notes'}
          </h3>
          <label className="block text-sm font-medium text-black mb-2">
            {isClient ? 'Tell us more about what you\'re looking for' : 'Notes'}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder={isClient ? 
              "e.g., Must have parking, prefer quiet neighborhood, need move-in ready..." : 
              "Enter any additional notes about this lead"
            }
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#018ABE] focus:border-[#018ABE] transition-colors resize-none"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
          )}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border-2 border-[#018ABE] text-[#018ABE] rounded-lg hover:bg-[#018ABE] hover:text-white transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#018ABE] text-white rounded-lg hover:bg-[#0179A8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 
              (isClient ? 
                (initialData ? 'Update Inquiry' : 'Submit Inquiry') : 
                (initialData ? 'Update Lead' : 'Add Lead')
              )
            }
          </button>
        </div>
      </form>
    </div>
  );
}
