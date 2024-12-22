from dotenv import load_dotenv
from mongoengine import connect
from mongomock import MongoClient
import os

# Load environment variables from .env file
load_dotenv()
DB_URI = os.getenv("DB_URI")

# Function to set up the database connection
def get_database(app=None):
    print("Connecting to the database...")
    try:
        if app and app.config.get("TESTING"):
            # Use in-memory MongoDB for testing
            connect(
                "test_db", host="mongodb://localhost", mongo_client_class=MongoClient
            )
            print("Created in-memory test database")
        else:
            # Connect to the production database
            connect("djwamp", host=DB_URI)
            print("Pinged deployment, connected to MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

# For testing purposes only
if __name__ == "__main__":
    get_database()

