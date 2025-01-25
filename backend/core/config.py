from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_dir: str = "models"
    model_name: str = "wav2vec2_arabic"

    model_confidence_threshold: float = 50.0
    max_upload_size: int = 10_000_000  # 10 MB
    recordings_dir: str = "recordings"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings retrieval to prevent multiple instantiations.

    Returns:
        Settings: Configured application settings
    """
    return Settings()  # type: ignore
