from flask import Blueprint

main = Blueprint("main", __name__)

from .user import user as user_blueprint

main.register_blueprint(user_blueprint)

from . import routes
