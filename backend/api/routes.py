import logging
import os
import time
import uuid
from functools import lru_cache
from typing import Annotated

import aiofiles
import torch
from core.config import get_settings
from errors import TranscriptionException
from fastapi import APIRouter, Depends
from schemas import AudioUploadModel, InferenceModel
from services.ai import SpeechRecognition

# from utils import init_logging_config


# init_logging_config()
settings = get_settings()


@lru_cache(maxsize=1)
def get_model_service():
    return SpeechRecognition(
        modeldir=settings.model_dir,
        modelname=settings.model_name,
        device=torch.device("cuda" if torch.cuda.is_available() else "cpu"),
    )


ModelService = Annotated[SpeechRecognition, Depends(get_model_service)]


router = APIRouter()


@router.post("/inferences")
async def infer(
    record: InferenceModel,
    model_service: ModelService,
) -> dict[str, str | float | bool]:
    try:
        predicted_text: str = model_service.transcribe(
            os.path.join("recordings/", record.recordpath)
        )
    except Exception:
        # logging.error(f"Error during transcription: {e}")
        raise TranscriptionException

    confidence = model_service.calculate_confidence(predicted_text, record.correct)

    return {
        "predicted_text": predicted_text,
        "confidence": confidence,
        "is_correct": confidence >= settings.model_confidence_threshold,
    }


@router.post("/uploads")
async def upload(
    model_service: ModelService,
    audio_data: AudioUploadModel = Depends(AudioUploadModel.parse_audio_upload),
) -> dict[str, str | dict[str, str | float | bool]]:
    os.makedirs("recordings", exist_ok=True)

    file_extension = os.path.splitext(str(audio_data.recording.filename))[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"recordings/{unique_filename}"

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await audio_data.recording.read()
        await out_file.write(content)

    inference_result = await infer(
        InferenceModel(recordpath=unique_filename, correct=audio_data.correct),
        model_service,
    )

    os.remove(file_path)

    return {
        "message": "File uploaded successfully",
        "filename": unique_filename,
        "is_correct": audio_data.correct,
        "inference_result": inference_result,
    }


# @router.put("/upload_record")
# async def upload_record(form: Form)
