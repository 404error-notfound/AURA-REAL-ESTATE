from flask import Blueprint, request
from modelsdb import db, Lead, User, LeadStatus
from utils.responses import success_response, error_response
from utils.validation import validate_lead_data
from flask_jwt_extended import jwt_required, get_jwt_identity

leads_bp = Blueprint("leads", __name__, url_prefix="/api/leads")

# Create a lead
@leads_bp.route("/", methods=["POST"])
@jwt_required()
def create_lead():
    identity = get_jwt_identity()
    data = request.get_json()
    
    # For clients, automatically set user_id to themselves
    if identity["user_type"] == "client":
        data["user_id"] = identity["id"]
    
    # Validate lead data
    is_valid, errors = validate_lead_data(data)
    if not is_valid:
        return error_response("Validation failed", "Invalid lead data", 400, {"validation_errors": errors})
    
    try:
        lead = Lead(
            status=LeadStatus(data.get("status", "new")),
            user_id=data.get("user_id"),
            property_id=data.get("property_id"),
            assigned_agent_id=data.get("assigned_agent_id"),
            source=data.get("source"),
            notes=data.get("notes"),
            budget_min=data.get("budget_min"),
            budget_max=data.get("budget_max"),
            preferred_contact=data.get("preferred_contact"),
            preferred_contact_time=data.get("preferred_contact_time"),
            desired_location=data.get("desired_location"),
            desired_property_type=data.get("desired_property_type"),
            desired_bedrooms=data.get("desired_bedrooms"),
            desired_bathrooms=data.get("desired_bathrooms")
        )

        db.session.add(lead)
        db.session.commit()

        return success_response(lead.to_dict(), "Lead created successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)

# Get all leads
@leads_bp.route("/", methods=["GET"])
@jwt_required()
def get_leads():
    try:
        identity = get_jwt_identity()
        if identity["user_type"] == "client":
            # Clients can only see leads they created
            leads = Lead.query.filter_by(user_id=identity["id"]).all()
        else:
            # Agents and admins can see all leads
            leads = Lead.query.all()
        return success_response([l.to_dict() for l in leads], "Leads retrieved successfully")
    except Exception as e:
        return error_response("Database Error", str(e), 500)

# Get a specific lead
@leads_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_lead(id):
    try:
        identity = get_jwt_identity()
        lead = Lead.query.get(id)
        if not lead:
            return error_response("Not Found", f"Lead {id} not found", 404)

        if identity["user_type"] == "client" and lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only view your own leads", 403)

        return success_response(lead.to_dict(), "Lead retrieved successfully")
    except Exception as e:
        return error_response("Database Error", str(e), 500)

# Update a lead
@leads_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_lead(id):
    try:
        identity = get_jwt_identity()
        lead = Lead.query.get(id)
        if not lead:
            return error_response("Not Found", f"Lead {id} not found", 404)

        if identity["user_type"] == "client" and lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only update your own leads", 403)

        data = request.get_json()
        
        # Validate lead data
        is_valid, errors = validate_lead_data(data)
        if not is_valid:
            return error_response("Validation failed", "Invalid lead data", 400, {"validation_errors": errors})
        
        # Update fields
        updatable_fields = [
            "status", "property_id", "assigned_agent_id", "source", "notes",
            "budget_min", "budget_max", "preferred_contact", "preferred_contact_time",
            "desired_location", "desired_property_type", "desired_bedrooms", "desired_bathrooms"
        ]
        
        for field in updatable_fields:
            if field in data:
                if field == "status":
                    lead.status = LeadStatus(data[field])
                else:
                    setattr(lead, field, data[field])

        db.session.commit()
        return success_response(lead.to_dict(), "Lead updated successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)

# Delete a lead
@leads_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_lead(id):
    try:
        identity = get_jwt_identity()
        lead = Lead.query.get(id)
        if not lead:
            return error_response("Not Found", f"Lead {id} not found", 404)

        if identity["user_type"] == "client" and lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only delete your own leads", 403)

        db.session.delete(lead)
        db.session.commit()
        return success_response({"id": id}, "Lead deleted successfully")
    except Exception as e:
        db.session.rollback()
        return error_response("Database Error", str(e), 500)
