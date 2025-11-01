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

@router.post("/labels", response_model=LabelResponse)
async def submit_label(
    label: LabelSubmission,
    wallet_address: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
<<<<<<< HEAD
=======
    """
    Submit a label for an audio file
    Validates, calls the on-chain program, then saves to database
    """
    
    # --- 1. Validation (เหมือนเดิม) ---
    # Check if audio file exists
    audio = db.query(AudioFile).filter(AudioFile.id == label.audio_id).first()
    if not audio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audio file with id {label.audio_id} not found"
        )
    
    # Check if user has already labeled this audio
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
    
    # --- 💡 2. เรียก Smart Contract ก่อน ---
>>>>>>> parent of d4bc41d (Merge pull request #3 from GotGjee/feature/smart-contract)
    try:
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

        tx_signature = await solana_service.record_label_on_chain(
            user_wallet=wallet_address,
            label_data=label.dict()
        )

        if not tx_signature:
            # ถ้า solana_service คืนค่า None (แปลว่าล้มเหลว)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to record label on-chain. Service returned no signature."
            )
<<<<<<< HEAD

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

    except HTTPException:
        raise  
    except Exception as e:
        db.rollback() 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )
    finally:
        db.close()  
=======
            
    except Exception as e:
        # ดักจับ Error อื่นๆ จาก solana_service (เช่น RPC down)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error communicating with Solana: {str(e)}"
        )

    # --- 💡 3. บันทึกลง Database (เมื่อ On-Chain สำเร็จ) ---
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
>>>>>>> parent of d4bc41d (Merge pull request #3 from GotGjee/feature/smart-contract)
