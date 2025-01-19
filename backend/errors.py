from fastapi import HTTPException


class TranscriptionException(HTTPException):
    def __init__(self, detail: str = "Error during transcription"):
        super().__init__(status_code=500, detail=detail)
