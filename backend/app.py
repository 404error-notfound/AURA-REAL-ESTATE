import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from modelsdb import db
from config import Config
from dotenv import load_dotenv
from routesapi import auth_bp, users_bp, properties_bp, leads_bp, communications_bp
from sqlalchemy import text

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS for development
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
            "supports_credentials": True
        }
    })
    
    # Configure database
    app.config.from_object(Config)
    db.init_app(app)
    
    # Configure JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(leads_bp)
    app.register_blueprint(communications_bp)

    @app.route("/")
    def home():
        return jsonify({"message": "Welcome to AURA Real Estate API"})

    return app

if __name__ == "__main__":
    app = create_app()
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        print("Database tables checked and created if needed!")
    
    app.run(debug=True, port=5000)
