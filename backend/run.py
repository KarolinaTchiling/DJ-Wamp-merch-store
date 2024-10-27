from app import create_app
from database import client

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
