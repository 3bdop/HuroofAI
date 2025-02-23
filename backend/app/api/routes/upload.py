"""Module for handling audio file uploads and transcription requests.

This module provides routes and functionality for uploading audio files,
processing them through speech recognition, and returning transcription results.
"""

import logging
import os
import uuid
from typing import Annotated

import aiofiles
import models
from api.deps import ModelService, settings
from api.routes.inference import infer
from fastapi import APIRouter, Depends

router = APIRouter()

AudioData = Annotated[
    models.AudioUploadModel, Depends(models.AudioUploadModel.parse_audio_upload)
]


@router.post("/")
async def upload(
    model_service: ModelService,
    audio_data: AudioData,
) -> dict[str, str | dict[str, str | float | bool]]:
    """Upload and transcribe an audio file.

    Uploads the given audio data, performs speech-to-text inference, and returns
    the results.  The uploaded file is temporarily saved, transcribed, and then
    deleted.

    Args:
        model_service (ModelService): The speech recognition service.
        audio_data (AudioUploadModel): The audio upload data, including the
        recording and correct transcription.

    Returns:
        dict[str, str | dict[str, str | float | bool]]: A dictionary containing
        a success message, the generated filename, the correct transcription,
        and the inference results.
    """
    os.makedirs(settings.recordings_dir, exist_ok=True)

    file_extension = os.path.splitext(str(audio_data.recording.filename))[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.recordings_dir, unique_filename)

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await audio_data.recording.read()
        await out_file.write(content)

    inference_result = await infer(
        models.InferenceModel(recordpath=unique_filename, correct=audio_data.correct),
        model_service,
    )

    os.remove(file_path)

    logging.info(audio_data.correct)
    logging.info(inference_result)

    return {
        "message": "File uploaded successfully",
        "filename": unique_filename,
        "is_correct": audio_data.correct,
        "inference_result": inference_result,
    }
