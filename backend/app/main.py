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
import os

import services.ml.model_actions as ma
import uvicorn
from api.deps import model, settings
from api.main import api_router
from fastapi import FastAPI
from utils._logger import init_logging_config

init_logging_config()

logging.info("Warming up the model...")
ma.warmup(model)

app = FastAPI()

logging.info("Initializing Routes...")
app.include_router(api_router)

logging.info("Server started 🚀")


def main() -> None:
    """Start the FastAPI server with the given settings.

    This function initializes and runs the FastAPI server using uvicorn. In
    debug mode, it uses auto-reload functionality and references the app via
    filepath. In production, it uses the app instance directly.

    Returns:
        None: This function runs indefinitely while the server is running.

    Raises:
        uvicorn.Error: If there are issues starting the server
    """
    logging.info("Starting server...")
    app_instance = (
        f"{os.path.basename(__file__).split('.')[0]}:app" if __debug__ else app
    )

    logging.info("Server started 🚀")
    uvicorn.run(
        app=app_instance,
        host=settings.server_ip,
        port=settings.server_port,
        reload=__debug__,
    )


if __name__ == "__main__":
    main()
