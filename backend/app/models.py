"""Models for handling backend and ai related requests.

This module contains SQLModel classes for handling audio uploads and inference requests.
"""

from typing import Self

from fastapi import File, Form, UploadFile
from sqlmodel import SQLModel


class AudioUploadModel(SQLModel):
    """Represents data for an audio upload.

    Includes the audio file itself and the correct transcription.
    """

    recording: UploadFile
    correct: str

    @classmethod
    async def parse_audio_upload(
        cls, recording: UploadFile = File(...), correct: str = Form(...)
    ) -> Self:
        """Parse audio upload data.

        Parses the audio upload data from the request, including the audio file and
        the correct transcription.

        Args:
            recording: The uploaded audio file.
            correct: The correct transcription of the audio.

        Returns:
            An instance of AudioUploadModel.
        """
        return cls(recording=recording, correct=correct)


class InferenceModel(SQLModel):
    """Represents an inference request.

    Contains the correct transcription and the path to the recording.

    Attributes:
        correct: The correct transcription for comparison.
        recordpath: Path to the audio recording file.
    """

    correct: str
    recordpath: str
