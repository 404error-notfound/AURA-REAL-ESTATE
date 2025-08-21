from flask import Blueprint, request
from modelsdb import db, Lead, User
from utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message

leads_bp = Blueprint("leads", __name__, url_prefix="/api/leads")

# Helper function to send email
def send_new_lead_email(lead):
    # TODO: Implement email functionality
    pass


# Create a lead (client can create only for themselves, agent/admin full)
@leads_bp.route("/", methods=["POST"])
@jwt_required()
def create_lead():
    identity = get_jwt_identity()
    data = request.get_json()

    if identity["role"] == "client":
        lead = Lead(
            name=identity["id"],
            contact_info=data.get("contact_info"),
            budget=data.get("budget"),
            preferences=data.get("preferences"),
            status="new",
            agent_id=None
        )
    else:
        lead = Lead(
            name=data.get("name"),
            contact_info=data.get("contact_info"),
            budget=data.get("budget"),
            preferences=data.get("preferences"),
            status=data.get("status", "new"),
            agent_id=data.get("agent_id")
        )

    db.session.add(lead)
    db.session.commit()

    # Send email notification
    send_new_lead_email(lead)

    return success_response(lead.to_dict(), "Lead created successfully")

# Get all leads (agent/admin full, client only their own)
@leads_bp.route("/", methods=["GET"])
@jwt_required()
def get_leads():
    identity = get_jwt_identity()
    if identity["role"] == "client":
        leads = Lead.query.filter_by(user_id=identity["id"]).all()
    else:
        leads = Lead.query.all()
    return success_response([l.to_dict() for l in leads], "Leads retrieved successfully")

# Get a specific lead
@leads_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_lead(id):
    identity = get_jwt_identity()
    lead = Lead.query.get(id)
    if not lead:
        return error_response("Not Found", f"Lead {id} not found", 404)

    if identity["role"] == "client" and lead.user_id != identity["id"]:
        return error_response("Forbidden", "You can only view your own leads", 403)

    return success_response(lead.to_dict(), "Lead retrieved successfully")

# Update a lead
@leads_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_lead(id):
    identity = get_jwt_identity()
    lead = Lead.query.get(id)
    if not lead:
        return error_response("Not Found", f"Lead {id} not found", 404)

    if identity["role"] == "client" and lead.user_id != identity["id"]:
        return error_response("Forbidden", "You can only update your own leads", 403)

    data = request.get_json()
    for field in ["name", "contact_info", "budget", "preferences", "status", "agent_id"]:
        if field in data and identity["role"] in ["agent", "admin"]:
            setattr(lead, field, data[field])
        elif field in ["contact_info", "budget", "preferences"] and identity["role"] == "client":
            setattr(lead, field, data[field])

    db.session.commit()
    return success_response(lead.to_dict(), "Lead updated successfully")

# Delete a lead
@leads_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_lead(id):
    identity = get_jwt_identity()
    lead = Lead.query.get(id)
    if not lead:
        return error_response("Not Found", f"Lead {id} not found", 404)

    if identity["role"] == "client" and lead.user_id != identity["id"]:
        return error_response("Forbidden", "You can only delete your own leads", 403)

    db.session.delete(lead)
    db.session.commit()
    return success_response({"id": id}, "Lead deleted successfully")
