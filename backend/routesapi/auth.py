from flask import Blueprint, request, jsonify
from ..modelsdb import db, User, UserType
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..utils.responses import success_response, error_response

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["name", "email", "password"]
        for field in required_fields:
            if field not in data:
                return error_response("Bad Request", f"Missing required field: {field}", 400)
        
        # Check if email already exists
        if User.query.filter_by(email=data["email"]).first():
            return error_response("Conflict", "Email already exists", 409)

        # Create new user
        user = User(
            name=data["name"],
            email=data["email"],
            user_type=UserType[data.get("user_type", "CLIENT").upper()]
        )
        user.set_password(data["password"])
        
        # Add optional fields if provided
        optional_fields = ["phone", "profile_image", "budget_min", "budget_max", 
                         "preferred_locations", "preferred_property_types"]
        for field in optional_fields:
            if field in data:
                setattr(user, field, data[field])
        
        db.session.add(user)
        db.session.commit()

        return success_response(user.to_dict(), "User registered successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response("Server Error", str(e), 500)

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ["email", "password"]):
            return error_response("Bad Request", "Missing email or password", 400)
        
        # Find user and check password
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not user.check_password(data["password"]):
            return error_response("Unauthorized", "Invalid credentials", 401)

        # Create access token with user type
        token = create_access_token(identity={
            "id": user.id,
            "user_type": user.user_type.value
        })
        
        return success_response({
            "token": token,
            "user": user.to_dict()
        }, "Login successful")
        
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
