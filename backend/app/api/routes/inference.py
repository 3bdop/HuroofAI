"""Routes for speech-to-text inference endpoints."""

import os

import models
from api.deps import ModelService, settings
from errors import TranscriptionException
from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def infer(
    record: models.InferenceModel,
    model_service: ModelService,
) -> dict[str, str | float | bool]:
    """Perform speech-to-text inference.

    Transcribes the audio from the provided record and calculates the confidence score
    compared to the correct transcription.

    Args:
        record (InferenceModel): The inference request data.
        model_service (ModelService): The speech recognition service.

    Returns:
        dict[str, str | float | bool]: The inference results, including predicted text,
            confidence score, and correctness flag.

    Raises:
        TranscriptionException: If an error occurs during transcription.
    """
    try:
        predicted_text: str = model_service.transcribe(
            os.path.join(settings.recordings_dir, record.recordpath)
        )
    except Exception as e:
        raise TranscriptionException from e

    confidence = model_service.calculate_confidence(predicted_text, record.correct)

    return {
        "predicted_text": predicted_text,
        "confidence": confidence,
        "is_correct": confidence >= settings.model_confidence_threshold,
    }
