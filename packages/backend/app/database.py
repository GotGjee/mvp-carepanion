import os
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

# Create engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database tables
def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

# Create mock audio data
def create_mock_audio_data(db):
    """Create mock audio files for testing"""
    from app.models import AudioFile
    
    # Check if mock data already exists
    existing = db.query(AudioFile).first()
    if existing:
        print("Mock audio data already exists, skipping...")
        return
    
    # Mock audio URLs (you can replace these with real URLs later)
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
    print(f"Created {len(mock_audios)} mock audio files!")