from flask import Blueprint, request
from ..modelsdb import db, User
from flask_jwt_extended import create_access_token
from ..utils.responses import success_response, error_response

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Register
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return error_response("Conflict", "Email already exists", 409)

    user = User(name=data["name"], email=data["email"], role=data.get("role", "client"))
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return success_response(user.to_dict(), "User registered successfully")

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return error_response("Unauthorized", "Invalid credentials", 401)

    token = create_access_token(identity={"id": user.id, "role": user.role})
    return success_response({"token": token, "user": user.to_dict()}, "Login successful")
