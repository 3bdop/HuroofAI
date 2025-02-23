"""API routes for the speech recognition service.

This module contains FastAPI route handlers for audio file uploads and speech-to-text
inference operations, managing the interaction between clients and the speech
recognition service.
"""

from api.routes import inference, upload
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(inference.router, prefix="/infer", tags=["AI"])
api_router.include_router(upload.router, prefix="/upload", tags=["Backend"])
