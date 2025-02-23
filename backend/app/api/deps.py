"""Dependencies module for FastAPI application.

This module provides dependency injection utilities for the FastAPI application,
specifically for managing ML model services and their dependencies.
"""

from functools import lru_cache
from typing import Annotated

import torch
from core.config import get_settings
from fastapi import Depends
from services.ml.speech_recognition import SpeechRecognition

settings = get_settings()


@lru_cache(maxsize=1)
def get_model_service() -> SpeechRecognition:
    """Get the speech recognition service.

    This function initializes and returns the speech recognition service, using the
    configured model directory, model name, and available device (CUDA if available,
    otherwise CPU).

    Returns:
        SpeechRecognition: The speech recognition service instance.
    """
    return SpeechRecognition(
        modeldir=settings.model_dir,
        modelname=settings.model_name,
        device=torch.device("cuda" if torch.cuda.is_available() else "cpu"),
    )


model = get_model_service()
ModelService = Annotated[SpeechRecognition, Depends(get_model_service)]
