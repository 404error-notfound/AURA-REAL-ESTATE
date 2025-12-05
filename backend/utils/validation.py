import re
from flask import jsonify

class ValidationError(Exception):
    def __init__(self, message, field=None):
        self.message = message
        self.field = field
        super().__init__(self.message)

def validate_email(email):
    """Validate email format"""
    if not email:
        raise ValidationError("Email is required", "email")
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise ValidationError("Invalid email format", "email")
    
    if len(email) > 120:
        raise ValidationError("Email must be less than 120 characters", "email")
    
    return True

def validate_password(password):
    """Validate password strength"""
    if not password:
        raise ValidationError("Password is required", "password")
    
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long", "password")
    
    if len(password) > 128:
        raise ValidationError("Password must be less than 128 characters", "password")
    
    # Check for uppercase letter
    if not re.search(r'[A-Z]', password):
        raise ValidationError("Password must contain at least one uppercase letter", "password")
    
    # Check for lowercase letter
    if not re.search(r'[a-z]', password):
        raise ValidationError("Password must contain at least one lowercase letter", "password")
    
    # Check for digit
    if not re.search(r'\d', password):
        raise ValidationError("Password must contain at least one number", "password")
    
    # Check for special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError("Password must contain at least one special character", "password")
    
    return True

def validate_name(name, field_name="name"):
    """Validate name fields"""
    if not name:
        raise ValidationError(f"{field_name.capitalize()} is required", field_name)
    
    if len(name.strip()) < 2:
        raise ValidationError(f"{field_name.capitalize()} must be at least 2 characters long", field_name)
    
    if len(name) > 100:
        raise ValidationError(f"{field_name.capitalize()} must be less than 100 characters", field_name)
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    if not re.match(r"^[a-zA-Z\s\-'\.]+$", name):
        raise ValidationError(f"{field_name.capitalize()} can only contain letters, spaces, hyphens, and apostrophes", field_name)
    
    return True

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Phone is optional
    
    # Remove all non-digit characters for validation
    digits_only = re.sub(r'\D', '', phone)
    
    if len(digits_only) < 10 or len(digits_only) > 15:
        raise ValidationError("Phone number must be between 10 and 15 digits", "phone")
    
    return True

def validate_property_data(data):
    """Validate property creation/update data"""
    errors = []
    
    # Required fields
    required_fields = ['title', 'property_type', 'price', 'address', 'city', 'state', 'zip_code']
    for field in required_fields:
        if not data.get(field):
            errors.append(f"{field.replace('_', ' ').title()} is required")
    
    # Title validation
    if data.get('title'):
        if len(data['title']) < 5:
            errors.append("Title must be at least 5 characters long")
        if len(data['title']) > 200:
            errors.append("Title must be less than 200 characters")
    
    # Price validation
    if data.get('price'):
        try:
            price = float(data['price'])
            if price <= 0:
                errors.append("Price must be greater than 0")
            if price > 999999999:
                errors.append("Price is too high")
        except (ValueError, TypeError):
            errors.append("Price must be a valid number")
    
    # Address validation
    if data.get('address') and len(data['address']) > 255:
        errors.append("Address must be less than 255 characters")
    
    # City validation
    if data.get('city'):
        if len(data['city']) > 100:
            errors.append("City must be less than 100 characters")
        if not re.match(r"^[a-zA-Z\s\-'\.]+$", data['city']):
            errors.append("City can only contain letters, spaces, hyphens, and apostrophes")
    
    # State validation
    if data.get('state'):
        if len(data['state']) > 100:
            errors.append("State must be less than 100 characters")
    
    # Zip code validation
    if data.get('zip_code'):
        if not re.match(r'^[\d\-\s]+$', data['zip_code']):
            errors.append("Zip code can only contain numbers, hyphens, and spaces")
        if len(data['zip_code']) > 20:
            errors.append("Zip code must be less than 20 characters")
    
    # Optional numeric fields validation
    numeric_fields = ['bedrooms', 'bathrooms', 'square_feet', 'lot_size', 'year_built', 'parking_spaces']
    for field in numeric_fields:
        if data.get(field) is not None:
            try:
                value = float(data[field])
                if value < 0:
                    errors.append(f"{field.replace('_', ' ').title()} cannot be negative")
                if field == 'year_built' and (value < 1800 or value > 2030):
                    errors.append("Year built must be between 1800 and 2030")
                if field in ['bedrooms', 'parking_spaces'] and value > 50:
                    errors.append(f"{field.replace('_', ' ').title()} seems unreasonably high")
                if field == 'bathrooms' and value > 20:
                    errors.append("Number of bathrooms seems unreasonably high")
            except (ValueError, TypeError):
                errors.append(f"{field.replace('_', ' ').title()} must be a valid number")
    
    # Coordinate validation
    if data.get('latitude') is not None:
        try:
            lat = float(data['latitude'])
            if lat < -90 or lat > 90:
                errors.append("Latitude must be between -90 and 90")
        except (ValueError, TypeError):
            errors.append("Latitude must be a valid number")
    
    if data.get('longitude') is not None:
        try:
            lng = float(data['longitude'])
            if lng < -180 or lng > 180:
                errors.append("Longitude must be between -180 and 180")
        except (ValueError, TypeError):
            errors.append("Longitude must be a valid number")
    
    # Property type validation
    valid_property_types = [
        'townhouse', 'condominium', 'apartment', 'retail', 'shopping_centre',
        'restaurant', 'hospital', 'warehouse', 'factory', 'farmland', 'raw_land'
    ]
    if data.get('property_type') and data['property_type'] not in valid_property_types:
        errors.append("Invalid property type")
    
    # Status validation
    valid_statuses = ['active', 'pending', 'sold', 'withdrawn']
    if data.get('status') and data['status'] not in valid_statuses:
        errors.append("Invalid status")
    
    return len(errors) == 0, errors

def validate_lead_data(data):
    """Validate lead creation/update data"""
    errors = []
    
    # user_id is only required if not provided automatically (for agents)
    # For clients, it will be set automatically
    if not data.get('user_id'):
        # This will be handled in the API route for clients
        pass
    
    # Budget validation
    if data.get('budget_min') and data.get('budget_max'):
        try:
            budget_min = float(data['budget_min'])
            budget_max = float(data['budget_max'])
            if budget_min > budget_max:
                errors.append("Minimum budget cannot be greater than maximum budget")
            if budget_min < 0 or budget_max < 0:
                errors.append("Budget values cannot be negative")
        except (ValueError, TypeError):
            errors.append("Budget values must be valid numbers")
    
    # Contact preferences validation
    valid_contact_methods = ['email', 'phone', 'text', 'any']
    if data.get('preferred_contact') and data['preferred_contact'] not in valid_contact_methods:
        errors.append("Invalid contact preference")
    
    valid_contact_times = ['morning', 'afternoon', 'evening', 'any']
    if data.get('preferred_contact_time') and data['preferred_contact_time'] not in valid_contact_times:
        errors.append("Invalid contact time preference")
    
    # Status validation
    valid_statuses = ['new', 'contacted', 'in_progress', 'qualified', 'unqualified', 'converted', 'lost']
    if data.get('status') and data['status'] not in valid_statuses:
        errors.append("Invalid lead status")
    
    # Property type validation
    valid_property_types = [
        'townhouse', 'condominium', 'apartment', 'retail', 'shopping_centre',
        'restaurant', 'hospital', 'warehouse', 'factory', 'farmland', 'raw_land'
    ]
    if data.get('desired_property_type') and data['desired_property_type'] not in valid_property_types:
        errors.append("Invalid desired property type")
    
    # Numeric fields validation
    if data.get('desired_bedrooms') is not None:
        try:
            bedrooms = int(data['desired_bedrooms'])
            if bedrooms < 0:
                errors.append("Desired bedrooms cannot be negative")
        except (ValueError, TypeError):
            errors.append("Desired bedrooms must be a valid number")
    
    if data.get('desired_bathrooms') is not None:
        try:
            bathrooms = float(data['desired_bathrooms'])
            if bathrooms < 0:
                errors.append("Desired bathrooms cannot be negative")
        except (ValueError, TypeError):
            errors.append("Desired bathrooms must be a valid number")
    
    # String length validations
    if data.get('source') and len(data['source']) > 100:
        errors.append("Source must be less than 100 characters")
    
    if data.get('desired_location') and len(data['desired_location']) > 500:
        errors.append("Desired location must be less than 500 characters")
    
    if data.get('desired_property_type') and len(data['desired_property_type']) > 500:
        errors.append("Desired property type must be less than 500 characters")
    
    return len(errors) == 0, errors

def validation_error_response(errors):
    """Create a standardized validation error response"""
    if isinstance(errors, list):
        return jsonify({
            "status": "error",
            "error": "Validation Error",
            "message": "Please correct the following errors",
            "errors": errors
        }), 400
    else:
        return jsonify({
            "status": "error",
            "error": "Validation Error",
            "message": str(errors)
        }), 400
