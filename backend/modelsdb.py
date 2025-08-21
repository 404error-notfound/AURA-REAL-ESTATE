from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# User Model
class User(db.Model):
    __tablename__ = 'users'  # Explicitly set table name
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # For storing hashed password
    phone = db.Column(db.String(20), nullable=True)
    budget = db.Column(db.Float, nullable=True)
    preferences = db.Column(db.Text, nullable=True)

    leads = db.relationship("Lead", backref="user", lazy=True)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "budget": self.budget,
            "preferences": self.preferences,
        }

# Property Model
class Property(db.Model):
    __tablename__ = "property"

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=True)
    square_feet = db.Column(db.Integer, nullable=True)
    property_type = db.Column(db.String(50), nullable=True)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # Relationship with images
    images = db.relationship("PropertyImage", backref="property", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "address": self.address,
            "price": self.price,
            "bathrooms": self.bathrooms,
            "square_feet": self.square_feet,
            "property_type": self.property_type,
            "agent_id": self.agent_id,
            "images": [img.to_dict() for img in self.images],
        }


class PropertyImage(db.Model):
    __tablename__ = "property_image"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("property.id"), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "image_url": self.image_url
        }

# Lead Model
class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50), default="new")
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("property.id"), nullable=False)
    assigned_agent_id = db.Column(db.Integer)

    communications = db.relationship("Communication", backref="lead", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "user_id": self.user_id,
            "property_id": self.property_id,
            "assigned_agent_id": self.assigned_agent_id,
        }

# Communication Model
class Communication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("lead.id"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(50), nullable=False)  # "agent" or "client"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "message": self.message,
            "sender": self.sender,
            "created_at": self.created_at.isoformat(),
        }
