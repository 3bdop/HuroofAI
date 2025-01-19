import logging
import os
import uuid

import aiofiles
import torch
from errors import TranscriptionException
from fastapi import APIRouter, Depends
from schemas import AudioUploadModel, InferenceModel
from services.ai import SpeechRecognition

rootpath: str = os.path.dirname(os.path.abspath("."))

router = APIRouter()

logger = logging.getLogger(__name__)

MODEL_DIR = "models"
MODEL_NAME = "wav2vec2_arabic"

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"USING {DEVICE}")

logger.info("loading model...")

model = SpeechRecognition(
    MODEL_DIR,
    MODEL_NAME,
    DEVICE,
)

logger.info("model loaded successfully!")


@router.get("/")
async def root():
    return {"message": "Nothing to show here"}


@router.post("/inferences")
async def inference(record: InferenceModel) -> dict[str, str | float | bool]:
    try:
        predicted_text: str = model.transcribe(
            os.path.join("recordings/", record.recordpath)
        )
    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        raise TranscriptionException

    confidence = model.calculate_confidence(predicted_text, record.correct)
    threshold = 50.0

    return {
        "predicted_text": predicted_text,
        "confidence": confidence,
        "is_correct": confidence >= threshold,
    }


@router.post("/uploads")
async def upload(
    audio_data: AudioUploadModel = Depends(
        AudioUploadModel.parse_audio_upload
    ),
) -> dict[str, str | dict[str, str | float | bool]]:
    logger.info("I AM HERE")
    os.makedirs("recordings", exist_ok=True)

    file_extension = os.path.splitext(str(audio_data.recording.filename))[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"recordings/{unique_filename}"

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await audio_data.recording.read()
        await out_file.write(content)

    logger.info("STARTING PREDICTION")
    inference_result = await inference(
        InferenceModel(recordpath=unique_filename, correct=audio_data.correct)
    )

    logger.info("DONE")
    return {
        "message": "File uploaded successfully",
        "filename": unique_filename,
        "is_correct": audio_data.correct,
        "inference_result": inference_result,
    }
