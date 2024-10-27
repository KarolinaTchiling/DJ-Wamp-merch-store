from flask import Flask


def create_app():
    print("creating blueprint")
    app = Flask(__name__)

    # configure other blueprints
    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)
    return app
