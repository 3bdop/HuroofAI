"""Module for custom HTTP exceptions used in the application."""

from fastapi import HTTPException


class TranscriptionException(HTTPException):
    """Custom exception for transcription errors.

    This exception is raised when an error occurs during the transcription process.
    """

    def __init__(self, detail: str = "Error during transcription") -> None:
        """Initialize the TranscriptionException with a 500 status code."""
        super().__init__(status_code=500, detail=detail)
