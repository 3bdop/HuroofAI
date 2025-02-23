"""Configuration module for the application.

This module defines the application settings and provides functionality
to load and cache configuration values from environment variables and .env files.

The settings include server configuration, model parameters, and file handling options.
Settings are managed using Pydantic's BaseSettings for validation and .env file support.

Typical usage example:

    settings = get_settings()
    model_dir = settings.model_dir
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings.

    This class defines the application settings using Pydantic's BaseSettings.
    Settings are loaded from environment variables and a .env file.

    Attributes:
        server_ip (str): IP address of the server.
        server_port (int): Port number of the server.
        model_dir (str): Directory containing the model files.
                    Defaults to "../ml/models".
        model_name (str): Name of the model. Defaults to "wav2vec2_arabic".
        model_confidence_threshold (float): Confidence threshold for model predictions.
                    Defaults to 50.0.
        max_upload_size (int): Maximum allowed upload size in bytes.
                    Defaults to 10 MB.
        recordings_dir (str): Directory to store uploaded recordings.
                    Defaults to "outputs".
        model_config (SettingsConfigDict): Configuration for loading settings.
                    Loads from environment variables and files.
    """

    server_ip: str
    server_port: int

    model_dir: str = "../ml/models"
    model_name: str = "wav2vec2_arabic"

    model_confidence_threshold: float = 50.0
    max_upload_size: int = 10_000_000  # 10 MB
    recordings_dir: str = "outputs"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings retrieval to prevent multiple instantiations.

    Returns:
        Settings: Configured application settings
    """
    return Settings()  # type: ignore
