from flask import Blueprint, request
from modelsdb import db, User
from utils.responses import success_response, error_response

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

# CREATE
@users_bp.route("/", methods=["POST"])
def create_user():
    data = request.get_json()
    if not data or "name" not in data or "email" not in data:
        return error_response("Validation Error", "Name and email are required", 400)

    try:
        user = User(
            name=data["name"],
            email=data["email"],
            phone=data.get("phone"),
            budget=data.get("budget"),
            preferences=data.get("preferences")
        )
        db.session.add(user)
        db.session.commit()
        return success_response(user.to_dict(), "User created successfully", 201)
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)


# READ ALL
@users_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return success_response([u.to_dict() for u in users], "Users fetched successfully")


# READ ONE
@users_bp.route("/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return error_response("Not Found", f"User with ID {id} not found", 404)
    return success_response(user.to_dict(), "User fetched successfully")


# UPDATE
@users_bp.route("/<int:id>", methods=["PUT"])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return error_response("Not Found", f"User with ID {id} not found", 404)

    data = request.get_json()
    try:
        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.phone = data.get("phone", user.phone)
        user.budget = data.get("budget", user.budget)
        user.preferences = data.get("preferences", user.preferences)
        db.session.commit()
        return success_response(user.to_dict(), "User updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)


# DELETE
@users_bp.route("/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return error_response("Not Found", f"User with ID {id} not found", 404)

    try:
        db.session.delete(user)
        db.session.commit()
        return success_response(message=f"User {id} deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)
