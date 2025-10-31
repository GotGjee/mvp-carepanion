from sqlalchemy import Column, String, Integer, BigInteger, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    wallet_address = Column(Text, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    gender = Column(Text, nullable=True)
    age_bracket = Column(Text, nullable=True)
    hearing_ability = Column(Text, nullable=True)
    nationality = Column(Text, nullable=True)

class AudioFile(Base):
    __tablename__ = "audio_files"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    file_url = Column(Text, nullable=False, unique=True)
    duration_seconds = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Label(Base):
    __tablename__ = "labels"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    owner_wallet = Column(Text, ForeignKey("users.wallet_address"), nullable=False)
    audio_id = Column(BigInteger, ForeignKey("audio_files.id"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    comfort_level = Column(Integer, nullable=True)
    clarity = Column(Integer, nullable=True)
    speaking_rate = Column(Text, nullable=True)
    perceived_empathy = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    transaction_hash = Column(Text, nullable=True, index=True)