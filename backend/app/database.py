from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, AudioMetadata
from config import Config

DATABASE_URL = Config.SQLALCHEMY_DATABASE_URI

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
