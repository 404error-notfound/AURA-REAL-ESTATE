from flask import Blueprint, request
from ..modelsdb import db, Property
from ..utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt_identity

properties_bp = Blueprint("properties", __name__, url_prefix="/api/properties")

# Create a property (only agent/admin)
@properties_bp.route("/", methods=["POST"])
@jwt_required()
def create_property():
    identity = get_jwt_identity()
    if identity["role"] not in ["agent", "admin"]:
        return error_response("Forbidden", "Only agents can create properties", 403)

    data = request.get_json()
    try:
        property = Property(
            address=data.get("address"),
            price=data.get("price"),
            bathrooms=data.get("bathrooms"),
            square_feet=data.get("square_feet"),
            property_type=data.get("property_type"),
            agent_id=identity["id"]
        )
        db.session.add(property)
        db.session.commit()
        return success_response(property.to_dict(), "Property created successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)

# Get all properties (everyone can view)
@properties_bp.route("/", methods=["GET"])
def get_properties():
    properties = Property.query.all()
    return success_response([p.to_dict() for p in properties], "Properties retrieved successfully")

# Get a property (everyone can view)
@properties_bp.route("/<int:id>", methods=["GET"])
def get_property(id):
    property = Property.query.get(id)
    if not property:
        return error_response("Not Found", f"Property {id} not found", 404)
    return success_response(property.to_dict(), "Property retrieved successfully")

# Update property (only agent/admin who owns it)
@properties_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_property(id):
    identity = get_jwt_identity()
    property = Property.query.get(id)
    if not property:
        return error_response("Not Found", f"Property {id} not found", 404)

    if identity["role"] not in ["agent", "admin"]:
        return error_response("Forbidden", "Only agents can update properties", 403)
    if identity["role"] == "agent" and property.agent_id != identity["id"]:
        return error_response("Forbidden", "You can only update your own properties", 403)

    data = request.get_json()
    for field in ["address", "price", "bathrooms", "square_feet", "property_type"]:
        if field in data:
            setattr(property, field, data[field])

    db.session.commit()
    return success_response(property.to_dict(), "Property updated successfully")

# Delete property (only agent/admin who owns it)
@properties_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_property(id):
    identity = get_jwt_identity()
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
