#!/usr/bin/env python3
"""
Database initialization script
Creates all tables defined in the models
"""

import sys
import os
sys.path.append('/app')

def init_database():
    """Initialize database with all tables"""
    try:
        # Print environment variables for debugging
        db_url = os.getenv("DATABASE_URL")
        print(f"DATABASE_URL from environment: {db_url}")
        
        # Set a clean DATABASE_URL if needed
        if not db_url or "983@db" in db_url:
            clean_url = "postgresql://schedulink_user:SecurePass123@db:5432/schedulink_db"
            os.environ["DATABASE_URL"] = clean_url
            print(f"Set clean DATABASE_URL: {clean_url}")
        
        # Import after setting environment
        from app.database import engine, Base
        from app.models import User, Slot
        
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
        
        # Test connection
        from sqlalchemy import text
        with engine.connect() as conn:
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = [row[0] for row in result]
            print(f"Created tables: {tables}")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_database()

