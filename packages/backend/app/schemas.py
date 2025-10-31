from pydantic import BaseModel, Field
from typing import Optional, Literal

# Authentication Schemas
class LoginRequest(BaseModel):
    wallet_address: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_new_user: bool

# Profile Schemas
class ProfileSetupRequest(BaseModel):
    gender: str
    age_bracket: str
    hearing_ability: str
    nationality: str

class ProfileResponse(BaseModel):
    wallet_address: str
    gender: Optional[str]
    age_bracket: Optional[str]
    hearing_ability: Optional[str]
    nationality: Optional[str]

class ProfileUpdateResponse(BaseModel):
    status: str = "success"
    user: ProfileResponse

# Audio Schemas
class AudioResponse(BaseModel):
    id: int
    file_url: str
    duration_seconds: Optional[int]

# Label Schemas
class LabelSubmission(BaseModel):
    audio_id: int
    comfort_level: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    clarity: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    speaking_rate: Literal["Slow", "Medium", "Fast"]
    perceived_empathy: Literal["Low", "Medium", "High"]
    notes: Optional[str] = None

class LabelResponse(BaseModel):
    status: str = "success"
    label_id: int
    transaction_signature: Optional[str] = None