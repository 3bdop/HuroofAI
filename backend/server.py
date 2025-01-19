import logging
import os

import uvicorn
from api.routes import router as api_router
from core.config import get_settings
from fastapi import FastAPI
from utils import init_logging_config

init_logging_config()

logger = logging.getLogger(__name__)

app = FastAPI()
logger.info("Initializing Routes")
app.include_router(api_router)


def main() -> None:
    logger.info("Starting server...")
    settings = get_settings()
    app_instance = (
        app if not __debug__ else f"{os.path.basename(__file__).split('.')[0]}:app"
    )

    uvicorn.run(
        app=app_instance,
        host=settings.server_ip,
        port=settings.server_port,
        reload=__debug__,
    )


if __name__ == "__main__":
    main()
