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
    pool_pre_ping=True,              # Test connections before using
    pool_recycle=3600,               # Recycle connections every hour
    pool_size=5,                     # Maintain 5 connections
    max_overflow=10,                 # Allow 10 extra connections temporarily
    connect_args={
        "connect_timeout": 30,       # 30 second timeout
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
                break  # Success - exit loop
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

# Create mock audio data
def create_mock_audio_data(db):
    """Create mock audio files for testing"""
    from app.models import AudioFile
    
    try:
        # Check if mock data already exists
        existing = db.query(AudioFile).first()
        if existing:
            print("ℹ️  Mock audio data already exists, skipping...")
            return
        
        # Mock audio URLs
        mock_audios = [
            {"file_url": "https://example.com/audio/sample1.mp3", "duration_seconds": 7},
            {"file_url": "https://example.com/audio/sample2.mp3", "duration_seconds": 5},
            {"file_url": "https://example.com/audio/sample3.mp3", "duration_seconds": 8},
            {"file_url": "https://example.com/audio/sample4.mp3", "duration_seconds": 6},
            {"file_url": "https://example.com/audio/sample5.mp3", "duration_seconds": 9},
            {"file_url": "https://example.com/audio/sample6.mp3", "duration_seconds": 7},
            {"file_url": "https://example.com/audio/sample7.mp3", "duration_seconds": 10},
            {"file_url": "https://example.com/audio/sample8.mp3", "duration_seconds": 8},
            {"file_url": "https://example.com/audio/sample9.mp3", "duration_seconds": 6},
            {"file_url": "https://example.com/audio/sample10.mp3", "duration_seconds": 7},
        ]
        
        for audio_data in mock_audios:
            audio = AudioFile(**audio_data)
            db.add(audio)
        
        db.commit()
        print(f"✅ Created {len(mock_audios)} mock audio files!")
    except Exception as e:
        print(f"⚠️  Failed to create mock audio data: {e}")
        db.rollback()