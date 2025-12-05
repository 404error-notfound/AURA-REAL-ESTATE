import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, current_app
from modelsdb import db, Property, PropertyType, PropertyImage
from utils.responses import success_response, error_response
from utils.validation import validate_property_data
from flask_jwt_extended import jwt_required, get_jwt_identity

properties_bp = Blueprint("properties", __name__, url_prefix="/api/properties")

# Helper functions for file handling
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """Save uploaded file and return the file path"""
    if file and allowed_file(file.filename):
        # Create unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        # Ensure uploads directory exists
        upload_dir = os.path.join(os.getcwd(), 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)
        
        # Return relative path for URL
        return f"/uploads/{unique_filename}"
    return None

# Create a property (only agent/admin)
@properties_bp.route("/", methods=["POST"])
@jwt_required()
def create_property():
    identity = get_jwt_identity()
    if identity["user_type"] not in ["agent", "admin"]:
        return error_response("Forbidden", "Only agents can create properties", 403)

    # Handle both JSON and FormData requests
    if request.content_type and 'multipart/form-data' in request.content_type:
        # FormData request (with files)
        data = request.form.to_dict()
        files = request.files.getlist('images')
    else:
        # JSON request (no files)
        data = request.get_json()
        files = []
    
    # Convert string values to appropriate types for numeric fields
    numeric_fields = ['price', 'latitude', 'longitude', 'bedrooms', 'bathrooms', 
                     'square_feet', 'lot_size', 'year_built', 'parking_spaces']
    for field in numeric_fields:
        if field in data and data[field]:
            try:
                if field in ['bedrooms', 'year_built', 'parking_spaces']:
                    data[field] = int(data[field])
                else:
                    data[field] = float(data[field])
            except (ValueError, TypeError):
                data[field] = None
    
    # Convert boolean fields
    if 'is_featured' in data:
        data['is_featured'] = data['is_featured'].lower() == 'true' if isinstance(data['is_featured'], str) else bool(data['is_featured'])
    
    # Validate property data
    is_valid, errors = validate_property_data(data)
    if not is_valid:
        return error_response("Validation failed", "Invalid property data", 400, {"validation_errors": errors})
    
    try:
        # Create property
        property = Property(
            title=data.get("title"),
            description=data.get("description"),
            property_type=PropertyType(data.get("property_type")),
            price=data.get("price"),
            address=data.get("address"),
            city=data.get("city"),
            state=data.get("state"),
            zip_code=data.get("zip_code"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            bedrooms=data.get("bedrooms"),
            bathrooms=data.get("bathrooms"),
            square_feet=data.get("square_feet"),
            lot_size=data.get("lot_size"),
            year_built=data.get("year_built"),
            parking_spaces=data.get("parking_spaces"),
            features=data.get("features"),
            amenities=data.get("amenities"),
            status=data.get("status", "active"),
            is_featured=data.get("is_featured", False),
            agent_id=identity["id"]
        )
        db.session.add(property)
        db.session.flush()  # Get the property ID
        
        # Handle file uploads
        if files:
            for i, file in enumerate(files):
                if file and file.filename:
                    # Check file size
                    file.seek(0, os.SEEK_END)
                    file_size = file.tell()
                    file.seek(0)
                    
                    if file_size > MAX_FILE_SIZE:
                        return error_response("File too large", f"File {file.filename} exceeds 5MB limit", 400)
                    
                    # Save file
                    file_path = save_uploaded_file(file)
                    if file_path:
                        property_image = PropertyImage(
                            property_id=property.id,
                            image_url=file_path,
                            is_primary=(i == 0),  # First image is primary
                            order=i
                        )
                        db.session.add(property_image)
        
        db.session.commit()
        return success_response(property.to_dict(), "Property created successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)

# Get all properties (everyone can view)
@properties_bp.route("/", methods=["GET"])
def get_properties():
    try:
        properties = Property.query.all()
        return success_response([p.to_dict() for p in properties], "Properties retrieved successfully")
    except Exception as e:
        return error_response("Database Error", str(e), 500)

# Get a property (everyone can view)
@properties_bp.route("/<int:id>", methods=["GET"])
def get_property(id):
    try:
        property = Property.query.get(id)
        if not property:
            return error_response("Not Found", f"Property {id} not found", 404)
        return success_response(property.to_dict(), "Property retrieved successfully")
    except Exception as e:
        return error_response("Database Error", str(e), 500)

# Update property (only agent/admin who owns it)
@properties_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_property(id):
    identity = get_jwt_identity()
    
    try:
        property = Property.query.get(id)
        if not property:
            return error_response("Not Found", f"Property {id} not found", 404)

        if identity["role"] not in ["agent", "admin"]:
            return error_response("Forbidden", "Only agents can update properties", 403)
        if identity["role"] == "agent" and property.agent_id != identity["id"]:
            return error_response("Forbidden", "You can only update your own properties", 403)

        data = request.get_json()
        
        # Validate property data
        is_valid, errors = validate_property_data(data)
        if not is_valid:
            return error_response("Validation failed", "Invalid property data", 400, {"validation_errors": errors})
        
        # Update only validated fields
        updatable_fields = [
            "title", "description", "price", "address", "city", 
            "state", "zip_code", "latitude", "longitude", "bedrooms", "bathrooms", 
            "square_feet", "lot_size", "year_built", "parking_spaces", "features", 
            "amenities", "status", "is_featured"
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(property, field, data[field])
        
        # Handle property_type enum conversion separately
        if "property_type" in data:
            property.property_type = PropertyType(data["property_type"])

        db.session.commit()
        return success_response(property.to_dict(), "Property updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)

# Delete property (only agent/admin who owns it)
@properties_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_property(id):
    identity = get_jwt_identity()
    
    try:
        property = Property.query.get(id)
        if not property:
            return error_response("Not Found", f"Property {id} not found", 404)

        if identity["role"] not in ["agent", "admin"]:
            return error_response("Forbidden", "Only agents can delete properties", 403)
        if identity["role"] == "agent" and property.agent_id != identity["id"]:
            return error_response("Forbidden", "You can only delete your own properties", 403)

        db.session.delete(property)
        db.session.commit()
        return success_response({"id": id}, "Property deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)
