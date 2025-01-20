from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AudioMetadata

router = APIRouter()


@router.post("/audio_metadata")
def create_audio_metadata(data: dict, db: Session = Depends(get_db)):
    try:
        new_record = AudioMetadata(
            filename=data["filename"],
            arabic_letter=data["arabic_letter"],
            file_path=data["file_path"],
            duration=data["duration"],
            user_session_id=data.get("user_session_id"),
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record.to_dict()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/audio_metadata/{filename}")
def get_audio_metadata(filename: str, db: Session = Depends(get_db)):
    record = db.query(AudioMetadata).filter_by(filename=filename).first()
    if record:
        return record.to_dict()
    raise HTTPException(status_code=404, detail="Record not found")


@router.put("/audio_metadata/{filename}")
def update_audio_metadata(
    filename: str, data: dict, db: Session = Depends(get_db)
):
    record = db.query(AudioMetadata).filter_by(filename=filename).first()
    if record:
        try:
            record.arabic_letter = data.get(
                "arabic_letter", record.arabic_letter
            )
            record.file_path = data.get("file_path", record.file_path)
            record.duration = data.get("duration", record.duration)
            record.user_session_id = data.get(
                "user_session_id", record.user_session_id
            )
            db.commit()
            db.refresh(record)
            return record.to_dict()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
    raise HTTPException(status_code=404, detail="Record not found")
