from flask import Blueprint, request
from modelsdb import db, Communication, Lead, User
from utils.responses import success_response, error_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message

communications_bp = Blueprint("communications", __name__, url_prefix="/api/communications")

# Helper function to send email
def send_new_message_email(comm):
    # TODO: Implement email functionality
    pass

# Create a message
@communications_bp.route("/", methods=["POST"])
@jwt_required()
def create_communication():
    identity = get_jwt_identity()
    data = request.get_json()

    if identity["role"] == "client":
        lead = Lead.query.get(data.get("lead_id"))
        if not lead or lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only message about your own leads", 403)

    comm = Communication(
        lead_id=data.get("lead_id"),
        agent_id=data.get("agent_id") if identity["role"] in ["agent", "admin"] else None,
        message=data.get("message")
    )
    db.session.add(comm)
    db.session.commit()

    # Send email notification
    send_new_message_email(comm)

    return success_response(comm.to_dict(), "Message sent successfully")

# Get communications
@communications_bp.route("/", methods=["GET"])
@jwt_required()
def get_communications():
    identity = get_jwt_identity()
    if identity["role"] in ["agent", "admin"]:
        comms = Communication.query.all()
    else:
        comms = Communication.query.join(Lead).filter(Lead.user_id == identity["id"]).all()
    return success_response([c.to_dict() for c in comms], "Communications retrieved successfully")

# Update a communication (only sender or agent/admin)
@communications_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_communication(id):
    identity = get_jwt_identity()
    comm = Communication.query.get(id)
    if not comm:
        return error_response("Not Found", f"Communication {id} not found", 404)

    if identity["role"] == "client":
        lead = Lead.query.get(comm.lead_id)
        if not lead or lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only update your own messages", 403)

    data = request.get_json()
    if "message" in data:
        comm.message = data["message"]

    db.session.commit()
    return success_response(comm.to_dict(), "Communication updated successfully")

# Delete a communication
@communications_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_communication(id):
    identity = get_jwt_identity()
    comm = Communication.query.get(id)
    if not comm:
        return error_response("Not Found", f"Communication {id} not found", 404)

    if identity["role"] == "client":
        lead = Lead.query.get(comm.lead_id)
        if not lead or lead.user_id != identity["id"]:
            return error_response("Forbidden", "You can only delete your own messages", 403)

    db.session.delete(comm)
    db.session.commit()
    return success_response({"id": id}, "Communication deleted successfully")
