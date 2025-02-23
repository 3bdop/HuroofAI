"""FastAPI application module for serving ML model endpoints.

This module initializes and configures a FastAPI application that serves machine
learning model endpoints. It handles model warming up, route initialization, and
server startup.

Attributes:
    app (FastAPI): The main FastAPI application instance.

Functions:
    main(): Starts the uvicorn server with configured settings.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.services.ml.model_actions as ma
from app.api.deps import model, settings
from app.api.main import api_router
from app.utils._logger import init_logging_config

init_logging_config()

logging.info("Warming up the model...")
ma.warmup(model)

app = FastAPI(
    title=settings.project_name,
    root_path="/",
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
)

logging.info("Initializing Routes...")

if settings.all_cors_origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origin,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(api_router)

logging.info("Server started 🚀")
