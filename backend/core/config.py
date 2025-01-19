from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    server_ip: str
    port: int

    class Config:
        env_file = ".env"


def get_settings():
    return Settings()  # type: ignore
