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
    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Accept"],
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
    
    # Drop and recreate all tables
    with app.app_context():
        db.session.execute(text('DROP SCHEMA public CASCADE'))
        db.session.execute(text('CREATE SCHEMA public'))
        db.session.commit()
        db.create_all()  # Create tables with the new schema
        print("Database tables recreated successfully!")
    
    app.run(debug=True, port=5000)
