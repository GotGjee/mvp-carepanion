from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_access_token(wallet_address: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "sub": wallet_address,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Verify JWT token and return wallet address
    Used as a dependency for protected routes
    """
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        wallet_address = payload.get("sub")
        
        if wallet_address is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return wallet_address
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Simplified login endpoint for MVP
    - Checks if user exists in database
    - Creates new user if first-time login
    - Returns JWT token and is_new_user flag
    """
    wallet_address = request.wallet_address.strip()
    
    if not wallet_address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wallet address is required"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    
    is_new_user = False
    
    if not user:
        # Create new user
        user = User(wallet_address=wallet_address)
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True
    else:
        # Check if profile is incomplete
        if not all([user.gender, user.age_bracket, user.hearing_ability, user.nationality]):
            is_new_user = True
    
    # Create JWT token
    access_token = create_access_token(wallet_address)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        is_new_user=is_new_user
    )