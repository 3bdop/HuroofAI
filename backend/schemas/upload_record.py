from typing import Self

from fastapi import File, Form, UploadFile
from pydantic import BaseModel


class AudioUploadModel(BaseModel):
    recording: UploadFile
    correct: str

    @classmethod
    async def parse_audio_upload(
        cls, recording: UploadFile = File(...), correct: str = Form(...)
    ) -> Self:
        return cls(recording=recording, correct=correct)