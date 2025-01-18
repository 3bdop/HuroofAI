from fastapi import FastAPI
from .database import engine, Base
from .api import audio


def create_app():
    app = FastAPI()

    # Create the database tables
    Base.metadata.create_all(bind=engine)

    # Include the audio routes
    app.include_router(audio.router)

    return app


app = create_app()
