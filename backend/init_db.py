# init_db.py
from app.models.user_model import Base
from app.services.db_service import engine

def init_database():
    Base.metadata.create_all(bind=engine)
    print("✓ Database initialized successfully")

if __name__ == "__main__":
    init_database()