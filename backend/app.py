import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from modelsdb import db, User
from config import Config
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    
    # Configure database
    app.config.from_object(Config)
    db.init_app(app)
    
    # Configure JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
    jwt = JWTManager(app)

    @app.route("/api/auth/register", methods=["POST"])
    def register():
        try:
            data = request.get_json()
            
            # Validate required fields
            if not all(key in data for key in ["name", "email", "password"]):
                return jsonify({
                    "success": False,
                    "message": "Missing required fields"
                }), 400
                
            # Check if user already exists
            if User.query.filter_by(email=data["email"]).first():
                return jsonify({
                    "success": False,
                    "message": "Email already registered"
                }), 400
                
            # Hash the password
            hashed_password = generate_password_hash(data["password"])
            
            # Create new user with hashed password
            new_user = User(
                name=data["name"],
                email=data["email"],
                password=hashed_password
            )
            
            # Add user to database
            db.session.add(new_user)
            db.session.commit()
            
            print(f"Successfully created user: {new_user.email}")
            
            return jsonify({
                "success": True,
                "message": "Registration successful"
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Error during registration: {str(e)}")
            # Print more detailed error information
            import traceback
            traceback.print_exc()
            return jsonify({
                "success": False,
                "message": f"Registration error: {str(e)}"
            }), 500

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        try:
            data = request.get_json()
            
            # Validate required fields
            if not all(key in data for key in ["email", "password"]):
                return jsonify({
                    "success": False,
                    "message": "Missing email or password"
                }), 400
            
            # Find user by email
            user = User.query.filter_by(email=data["email"]).first()
            
            # Check if user exists and password is correct
            if user and check_password_hash(user.password, data["password"]):
                # Create access token
                access_token = create_access_token(identity=user.id)
                
                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "token": access_token,
                        "user": {
                            "id": user.id,
                            "name": user.name,
                            "email": user.email
                        }
                    }
                }), 200
            else:
                return jsonify({
                    "success": False,
                    "message": "Invalid email or password"
                }), 401
                
        except Exception as e:
            print(f"Error during login: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({
                "success": False,
                "message": f"Login error: {str(e)}"
            }), 500

    @app.route("/")
    def home():
        return jsonify({"message": "Welcome to AURA Real Estate API"})

    return app

if __name__ == "__main__":
    app = create_app()
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()  # This will create tables only if they don't exist
        print("Database tables checked/created successfully!")
    
    app.run(debug=True, port=5000)
