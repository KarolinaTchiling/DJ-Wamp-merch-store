from env import DB_URI
from mongoengine import connect


def get_db():
    connect(DB_URI)
    try:
        client.admin.command("ping")
        print("Pinged Deployment, Connected to DB")
        return client
    except Exception as e:
        print(f"Failed to connect to DB: {e}")
    return client


if __name__ == "__main__":
    # Get the database
    db = get_db()
