import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
from .modelsdb import db
from .config import Config
from .routesapi import users_bp, properties_bp, leads_bp, communications_bp, auth_bp
from dotenv import load_dotenv
from .utils.responses import success_response, error_response

load_dotenv()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # limit 5MB per file

    app.config["JWT_SECRET_KEY"] = "super-secret-key"
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    jwt = JWTManager(app)

    # Flask-Mail setup
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = "youremail@gmail.com"        # use env vars in production
    app.config["MAIL_PASSWORD"] = "yourpassword"              # use env vars in production

    mail.init_app(app)

    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(leads_bp)
    app.register_blueprint(communications_bp)
    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return success_response(message="Welcome to AURA Real Estate API")

    # ---------------------------
    # Error Handlers (wrapped)
    # ---------------------------
    @app.errorhandler(404)
    def not_found(error):
        return error_response("Not Found", str(error), 404)

    @app.errorhandler(400)
    def bad_request(error):
        return error_response("Bad Request", str(error), 400)

    @app.errorhandler(500)
    def internal_error(error):
        return error_response("Internal Server Error", "Something went wrong on the server.", 500)

    @app.errorhandler(Exception)
    def handle_exception(error):
        return error_response("Unexpected Error", str(error), 500)

    return app


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    app.run(debug=True)
