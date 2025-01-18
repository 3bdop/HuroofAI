from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from config import Config

Base = declarative_base()
DATABASE_URL = Config.SQLALCHEMY_DATABASE_URI


class AudioMetadata(Base):
    __tablename__ = "audio_metadata"

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String(255), unique=True, nullable=False)
    upload_timestamp = Column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    arabic_letter = Column(String(10), nullable=False)
    file_path = Column(String(500), nullable=False)
    duration = Column(Float, nullable=False)
    user_session_id = Column(String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "upload_timestamp": self.upload_timestamp.isoformat(),
            "arabic_letter": self.arabic_letter,
            "file_path": self.file_path,
            "duration": self.duration,
            "user_session_id": self.user_session_id,
        }
