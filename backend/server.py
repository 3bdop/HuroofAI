import logging
import os
import sys

import uvicorn
from api.routes import router as api_router

# from core.config import get_settings
from fastapi import FastAPI
from utils import init_logging_config
from pydantic_settings import BaseSettings


init_logging_config()
logger = logging.getLogger(__name__)

# app = FastAPI()
logger.info("Initializing Routes")
# app.include_router(api_router)


# def main() -> None:
#     logger.info("Starting server...")
#     settings = get_settings()
#     app_instance = (
#         app if not __debug__ else f"{os.path.basename(__file__).split('.')[0]}:app"
#     )
#
#     uvicorn.run(
#         app=app_instance,
#         host=settings.server_ip,
#         port=settings.server_port,
#         reload=__debug__,
#     )
#
#
# if __name__ == "__main__":
#     main()


class Settings(BaseSettings):
    # ... The rest of our FastAPI settings

    BASE_URL: str = "http://localhost:8000"
    USE_NGROK: bool = os.environ.get("USE_NGROK", "False") == "True"


settings = Settings()


def init_webhooks(base_url):
    # Update inbound traffic via APIs to use the public-facing ngrok URL
    pass


# Initialize the FastAPI app for a simple web server
app = FastAPI()
app.include_router(api_router)

if settings.USE_NGROK and os.environ.get("NGROK_AUTHTOKEN"):
    # pyngrok should only ever be installed or initialized in a dev environment when this flag is set
    from pyngrok import ngrok

    # Get the dev server port (defaults to 8000 for Uvicorn, can be overridden with `--port`
    # when starting the server
    port = sys.argv[sys.argv.index("--port") + 1] if "--port" in sys.argv else "8000"

    # Open a ngrok tunnel to the dev server
    public_url = ngrok.connect(port).public_url
    logger.info(f'ngrok tunnel "{public_url}" -> "http://127.0.0.1:{port}"')

    # Update any base URLs or webhooks to use the public ngrok URL
    settings.BASE_URL = public_url
    init_webhooks(public_url)

# ... Initialize routers and the rest of our app
