from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.models import AudioFile, Label
from app.schemas import AudioResponse, LabelSubmission, LabelResponse
from app.routers.auth import verify_token
from app.services.solana_service import solana_service

router = APIRouter(prefix="/api", tags=["Labeling"])

@router.get("/audio/next", response_model=AudioResponse)
def get_next_audio(
    wallet_address: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get next unlabeled audio file for the current user
    Returns 404 if no unlabeled audio files are available
    """
    # Get all audio IDs that this user has already labeled
    labeled_audio_ids = db.query(Label.audio_id).filter(
        Label.owner_wallet == wallet_address
    ).all()
    labeled_ids = [audio_id[0] for audio_id in labeled_audio_ids]
    
    # Find first audio file that user hasn't labeled yet
    query = db.query(AudioFile)
    
    if labeled_ids:
        query = query.filter(AudioFile.id.notin_(labeled_ids))
    
    audio = query.order_by(AudioFile.id).first()
    
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No more audio files available to label"
        )
    
    return AudioResponse(
        id=audio.id,
        file_url=audio.file_url,
        duration_seconds=audio.duration_seconds
    )

# --- 💡 1. เปลี่ยนเป็น async def ---
@router.post("/labels", response_model=LabelResponse)
async def submit_label( 
    label: LabelSubmission,
    wallet_address: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Submit a label for an audio file
    Validates, calls the on-chain program, then saves to database
    """
    
    audio = db.query(AudioFile).filter(AudioFile.id == label.audio_id).first()
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audio file with id {label.audio_id} not found"
        )
    
    existing_label = db.query(Label).filter(
        and_(
            Label.owner_wallet == wallet_address,
            Label.audio_id == label.audio_id
        )
    ).first()
    
    if existing_label:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already labeled this audio file"
        )
    
    try:
        tx_signature = await solana_service.record_label_on_chain(
            user_wallet=wallet_address,
            label_data=label.dict()  # แปลง Pydantic model เป็น dict
        )
        
        if not tx_signature:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record label on-chain. Service returned no signature."
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error communicating with Solana: {str(e)}"
        )

    new_label = Label(
        owner_wallet=wallet_address,
        audio_id=label.audio_id,
        comfort_level=label.comfort_level,
        clarity=label.clarity,
        speaking_rate=label.speaking_rate,
        perceived_empathy=label.perceived_empathy,
        notes=label.notes,
        transaction_hash=tx_signature  
    )
    
    db.add(new_label)
    db.commit()
    db.refresh(new_label)
    
    return LabelResponse(
        status="success",
        label_id=new_label.id,
        transaction_signature=tx_signature
    )