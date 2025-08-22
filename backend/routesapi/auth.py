from flask import Blueprint, request, jsonify, current_app
from modelsdb import db, User, UserType
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.responses import success_response, error_response
from utils.validation import (
    validate_email, validate_password, validate_name, validate_phone, 
    ValidationError, validation_error_response
)
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        print("=== REGISTRATION REQUEST RECEIVED ===")
        data = request.get_json()
        print("Request data:", data)
        print("Request headers:", dict(request.headers))
        
        if not data:
            print("ERROR: No data provided")
            return error_response("Bad Request", "No data provided", 400)
        
        # Validate required fields presence
        required_fields = ["name", "email", "password"]
        for field in required_fields:
            if not data.get(field):
                print(f"Missing field: {field}")
                return error_response("Bad Request", f"Missing required field: {field}", 400)
        
        # Detailed validation
        errors = []
        
        try:
            validate_name(data["name"].strip())
        except ValidationError as e:
            errors.append(e.message)
        
        try:
            validate_email(data["email"].strip().lower())
        except ValidationError as e:
            errors.append(e.message)
        
        try:
            validate_password(data["password"])
        except ValidationError as e:
            errors.append(e.message)
        
        # Validate phone if provided
        if data.get("phone"):
            try:
                validate_phone(data["phone"])
            except ValidationError as e:
                errors.append(e.message)
        
        # Validate user type
        user_type_str = data.get("user_type", "CLIENT").upper()
        if user_type_str not in [ut.name for ut in UserType]:
            errors.append("Invalid user type")
        
        # Return validation errors if any
        if errors:
            print("Validation errors:", errors)
            return validation_error_response(errors)
        
        # Check if email already exists
        email = data["email"].strip().lower()
        if User.query.filter_by(email=email).first():
            print(f"Email already exists: {email}")
            return error_response("Conflict", "Email already exists", 409)

        # Create new user with validated data
        user = User(
            name=data["name"].strip(),
            email=email,
            password=data["password"],
            user_type=UserType[user_type_str]
        )
        
        # Add optional fields if provided and valid
        if data.get("phone"):
            user.phone = data["phone"].strip()
        
        optional_fields = ["profile_image", "budget_min", "budget_max", 
                         "preferred_locations", "preferred_property_types"]
        for field in optional_fields:
            if field in data and data[field] is not None:
                setattr(user, field, data[field])
        
        db.session.add(user)
        db.session.commit()
        
        print(f"User created successfully: {user.email}")
        return success_response(user.to_dict(), "User registered successfully")
        
    except ValidationError as e:
        print(f"Validation error: {e.message}")
        db.session.rollback()
        return error_response("Validation Error", e.message, 400)
    except Exception as e:
        print(f"Server error: {str(e)}")
        db.session.rollback()
        return error_response("Server Error", str(e), 500)

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return error_response("Bad Request", "No data provided", 400)
        
        # Validate required fields
        if not all(key in data for key in ["email", "password"]):
            return error_response("Bad Request", "Missing email or password", 400)
        
        # Validate email format
        try:
            validate_email(data["email"])
        except ValidationError as e:
            return error_response("Bad Request", e.message, 400)
        
        # Check password is not empty
        if not data["password"]:
            return error_response("Bad Request", "Password is required", 400)
        
        # Find user and check password
        email = data["email"].strip().lower()
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(data["password"]):
            return error_response("Unauthorized", "Invalid email or password", 401)

        # Create access token with user type
        token = create_access_token(identity={
            "id": user.id,
            "user_type": user.user_type.value
        })
        
        return success_response({
            "token": token,
            "user": user.to_dict()
        }, "Login successful")
        
    except ValidationError as e:
        return error_response("Validation Error", e.message, 400)
    except Exception as e:
        return error_response("Server Error", str(e), 500)

# Get current user
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])
        if not user:
            return error_response("Not Found", "User not found", 404)
            
        return success_response(user.to_dict(), "User retrieved successfully")
        
    except Exception as e:
        return error_response("Server Error", str(e), 500)

# Logout endpoint not needed on backend as it's handled on frontend by removing the token
