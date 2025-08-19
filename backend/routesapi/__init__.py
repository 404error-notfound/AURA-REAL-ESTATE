from .users import users_bp
from .properties import properties_bp
from .leads import leads_bp
from .communications import communications_bp

# Export them for easy import
__all__ = ["users_bp", "properties_bp", "leads_bp", "communications_bp"]
