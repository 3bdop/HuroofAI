import logging
import os
import sys
import uvicorn
from api.routes import router as api_router
from fastapi import FastAPI
from api.routes import get_model_service
from pydantic_settings import BaseSettings
from utils import init_logging_config, warmup_model



logger = logging.getLogger(__name__)
init_logging_config()

logging.info("Warming up the model...")
warmup_model(get_model_service())



logging.info("Initializing Routes...")

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
# def main() -> None:
#     logging.info("Starting server...")
#     settings = get_settings()
#     app_instance = (
#         app if not __debug__ else f"{os.path.basename(__file__).split('.')[0]}:app"
#     )

#     logging.info("Server started 🚀")
#     uvicorn.run(
#         app=app_instance,
#         host=settings.server_ip,
#         port=settings.server_port,
#         reload=__debug__,
#     )


# if __name__ == "__main__":
#     main()
