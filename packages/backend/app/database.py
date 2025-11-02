import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine with connection pooling and retry settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,              
    pool_recycle=3600,              
    pool_size=5,                    
    max_overflow=10,                 
    connect_args={
        "connect_timeout": 30,      
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get database session with retry logic
def get_db():
    """Database session dependency with automatic retry"""
    max_retries = 3
    retry_delay = 1
    db = None
    
    try:
        for attempt in range(max_retries):
            try:
                db = SessionLocal()
                yield db
                break  
            except Exception as e:
                if db:
                    db.rollback()
                    db.close()
                    db = None
                
                if attempt < max_retries - 1:
                    print(f"⚠️  DB connection failed (attempt {attempt + 1}/{max_retries}), retrying in {retry_delay}s...")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    print(f"❌ DB connection failed after {max_retries} attempts: {e}")
                    raise
    except GeneratorExit:
        # Handle generator cleanup
        if db:
            db.close()
        raise
    except Exception:
        # Handle other exceptions
        if db:
            db.rollback()
            db.close()
        raise
    finally:
        # Final cleanup
        if db:
            try:
                db.close()
            except:
                pass

# Initialize database tables
def init_db():
    """Create all tables in the database"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Database tables created successfully!")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"⚠️  Failed to initialize DB (attempt {attempt + 1}/{max_retries}), retrying...")
                time.sleep(2)
            else:
                print(f"❌ Failed to initialize database: {e}")
                raise e

