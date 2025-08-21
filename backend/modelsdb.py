from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum as PyEnum

db = SQLAlchemy()

class UserType(PyEnum):
    CLIENT = 'client'
    AGENT = 'agent'
    ADMIN = 'admin'

class PropertyType(PyEnum):
    TOWNHOUSE = 'townhouse'
    CONDOMINIUM = 'condominium'
    APARTMENT = 'apartment'
    RETAIL = 'retail'
    SHOPPING_CENTRE = 'shopping_centre'
    RESTAURANT = 'restaurant'
    HOSPITAL = 'hospital'
    WAREHOUSE = 'warehouse'
    FACTORY = 'factory'
    FARMLAND = 'farmland'
    RAW_LAND = 'raw_land'

class LeadStatus(PyEnum):
    NEW = 'new'
    CONTACTED = 'contacted'
    IN_PROGRESS = 'in_progress'
    QUALIFIED = 'qualified'
    UNQUALIFIED = 'unqualified'
    CONVERTED = 'converted'
    LOST = 'lost'

# User Model
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.Enum(UserType), default=UserType.CLIENT)
    phone = db.Column(db.String(20))
    profile_image = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Client-specific fields
    budget_min = db.Column(db.Float)
    budget_max = db.Column(db.Float)
    preferred_locations = db.Column(db.String(500))
    preferred_property_types = db.Column(db.String(500))
    
    # Agent-specific fields
    service_areas = db.Column(db.String(500))
    license_number = db.Column(db.String(100))
    specializations = db.Column(db.String(500))

    # Relationships
    properties_listed = db.relationship('Property', backref='agent', lazy=True)
    leads_assigned = db.relationship('Lead', backref='assigned_agent', lazy=True, 
                                   foreign_keys='Lead.assigned_agent_id')
    leads_created = db.relationship('Lead', backref='client', lazy=True,
                                  foreign_keys='Lead.user_id')
    messages_sent = db.relationship('Communication', backref='sender', lazy=True,
                                  foreign_keys='Communication.sender_id')
    messages_received = db.relationship('Communication', backref='recipient', lazy=True,
                                      foreign_keys='Communication.recipient_id')

    def __init__(self, name, email, user_type=UserType.CLIENT):
        self.name = name
        self.email = email
        self.user_type = user_type

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        data = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "user_type": self.user_type.value,
            "profile_image": self.profile_image,
            "created_at": self.created_at.isoformat(),
        }
        
        if self.user_type == UserType.CLIENT:
            data.update({
                "budget_min": self.budget_min,
                "budget_max": self.budget_max,
                "preferred_locations": self.preferred_locations,
                "preferred_property_types": self.preferred_property_types,
            })
        elif self.user_type == UserType.AGENT:
            data.update({
                "service_areas": self.service_areas,
                "license_number": self.license_number,
                "specializations": self.specializations,
            })
        
        return data

# Property Model
class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    property_type = db.Column(db.Enum(PropertyType), nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    # Location details
    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    # Property details
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Float)
    square_feet = db.Column(db.Float)
    lot_size = db.Column(db.Float)
    year_built = db.Column(db.Integer)
    parking_spaces = db.Column(db.Integer)
    
    # Features and amenities (JSON string)
    features = db.Column(db.Text)  # JSON string of features
    amenities = db.Column(db.Text)  # JSON string of amenities
    
    # Status and metadata
    status = db.Column(db.String(50), default='active')
    is_featured = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    favorite_count = db.Column(db.Integer, default=0)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    images = db.relationship("PropertyImage", backref="property", cascade="all, delete-orphan")
    leads = db.relationship("Lead", backref="property", lazy=True)
    favorited_by = db.relationship('User', secondary='favorites',
                                 backref=db.backref('favorite_properties', lazy='dynamic'))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "property_type": self.property_type.value,
            "price": self.price,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "square_feet": self.square_feet,
            "lot_size": self.lot_size,
            "year_built": self.year_built,
            "parking_spaces": self.parking_spaces,
            "features": self.features,
            "amenities": self.amenities,
            "status": self.status,
            "is_featured": self.is_featured,
            "view_count": self.view_count,
            "favorite_count": self.favorite_count,
            "agent_id": self.agent_id,
            "images": [img.to_dict() for img in self.images],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class PropertyImage(db.Model):
    __tablename__ = "property_images"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(200))
    is_primary = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)  # For ordering in carousel
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "image_url": self.image_url,
            "caption": self.caption,
            "is_primary": self.is_primary,
            "order": self.order,
            "created_at": self.created_at.isoformat()
        }

# Lead Model
class Lead(db.Model):
    __tablename__ = "leads"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(LeadStatus), default=LeadStatus.NEW)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=True)
    assigned_agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    
    # Lead details
    source = db.Column(db.String(100))  # Where the lead came from
    notes = db.Column(db.Text)
    budget_min = db.Column(db.Float)
    budget_max = db.Column(db.Float)
    preferred_contact = db.Column(db.String(50))  # email, phone, etc.
    preferred_contact_time = db.Column(db.String(50))  # morning, afternoon, evening
    
    # Requirements
    desired_location = db.Column(db.String(500))
    desired_property_type = db.Column(db.String(500))
    desired_bedrooms = db.Column(db.Integer)
    desired_bathrooms = db.Column(db.Integer)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_contacted = db.Column(db.DateTime)

    # Relationships
    interactions = db.relationship("LeadInteraction", backref="lead", lazy=True)
    communications = db.relationship("Communication", backref="lead", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status.value,
            "user_id": self.user_id,
            "property_id": self.property_id,
            "assigned_agent_id": self.assigned_agent_id,
            "source": self.source,
            "notes": self.notes,
            "budget_min": self.budget_min,
            "budget_max": self.budget_max,
            "preferred_contact": self.preferred_contact,
            "preferred_contact_time": self.preferred_contact_time,
            "desired_location": self.desired_location,
            "desired_property_type": self.desired_property_type,
            "desired_bedrooms": self.desired_bedrooms,
            "desired_bathrooms": self.desired_bathrooms,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_contacted": self.last_contacted.isoformat() if self.last_contacted else None
        }

class LeadInteraction(db.Model):
    __tablename__ = "lead_interactions"

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("leads.id"), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    interaction_type = db.Column(db.String(50), nullable=False)  # call, email, meeting, etc.
    notes = db.Column(db.Text)
    scheduled_at = db.Column(db.DateTime)  # For future interactions
    completed_at = db.Column(db.DateTime)  # When the interaction occurred
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "agent_id": self.agent_id,
            "interaction_type": self.interaction_type,
            "notes": self.notes,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "created_at": self.created_at.isoformat()
        }

# Communication Model
class Communication(db.Model):
    __tablename__ = "communications"

    id = db.Column(db.Integer, primary_key=True)
    lead_id = db.Column(db.Integer, db.ForeignKey("leads.id"), nullable=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lead_id": self.lead_id,
            "sender_id": self.sender_id,
            "recipient_id": self.recipient_id,
            "subject": self.subject,
            "message": self.message,
            "is_read": self.is_read,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "created_at": self.created_at.isoformat()
        }

# Favorites association table
class Favorite(db.Model):
    __tablename__ = "favorites"
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "property_id": self.property_id,
            "created_at": self.created_at.isoformat()
        }
