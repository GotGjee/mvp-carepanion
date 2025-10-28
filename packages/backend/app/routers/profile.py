from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import ProfileSetupRequest, ProfileResponse, ProfileUpdateResponse
from app.routers.auth import verify_token

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/me", response_model=ProfileResponse)
def get_profile(
    wallet_address: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get current user's profile
    Requires JWT authentication
    """
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return ProfileResponse(
        wallet_address=user.wallet_address,
        gender=user.gender,
        age_bracket=user.age_bracket,
        hearing_ability=user.hearing_ability,
        nationality=user.nationality
    )

@router.post("/setup", response_model=ProfileUpdateResponse)
def setup_profile(
    profile: ProfileSetupRequest,
    wallet_address: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Setup or update user profile
    Requires JWT authentication
    """
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user profile
    user.gender = profile.gender
    user.age_bracket = profile.age_bracket
    user.hearing_ability = profile.hearing_ability
    user.nationality = profile.nationality
    
    db.commit()
    db.refresh(user)
    
    return ProfileUpdateResponse(
        status="success",
        user=ProfileResponse(
            wallet_address=user.wallet_address,
            gender=user.gender,
            age_bracket=user.age_bracket,
            hearing_ability=user.hearing_ability,
            nationality=user.nationality
        )
    )