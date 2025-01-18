import datetime
import os
import time
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pydub import AudioSegment

# from sqlalchemy.orm import Session
# from .database import engine, SessionLocal
# from .models import AudioMetadata, Base


# Create the FastAPI app
app = FastAPI()

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define the uploads directory relative to the script's directory
UPLOAD_DIR = os.path.join(BASE_DIR, "../uploads")

# Ensure the uploads directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Ensure FFmpeg is available
# FFMPEG_INSTALLED = os.system("ffmpeg -version") == 0
# if not FFMPEG_INSTALLED:
#     raise RuntimeError("FFmpeg is not installed or not available in PATH.")

# Base.metadata.create_all(bind=engine)


@app.post("/upload")
async def upload_file(file: UploadFile, filename: str = Form(...)):
    """
    Uploads an audio file, converts it to MP3 format, and saves it.
    """
    # if not file.content_type.startswith("audio/"):
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Invalid file type. Only audio files are allowed.",
    #     )

    try:
        # # Ensure sanitized filename
        # original_filename = os.path.basename(filename)
        # sanitized_filename = original_filename.replace(".m4a", ".mp3")
        # temp_path = os.path.join(UPLOAD_DIR, original_filename)
        # dest_path = os.path.join(UPLOAD_DIR, sanitized_filename)

        # Get the current timestamp in UNIX epoch format
        # timestamp = int(time.time())

        # Ensure sanitized filename
        original_filename = os.path.basename(filename)
        # sanitized_filename = (
        #     f"{original_filename.replace('.m4a', '')}_{timestamp}.mp3"
        # )
        sanitized_filename = f"{original_filename.replace('.m4a', '')}.mp3"
        temp_path = os.path.join(UPLOAD_DIR, original_filename)
        dest_path = os.path.join(UPLOAD_DIR, sanitized_filename)

        # Save the uploaded file temporarily
        with open(temp_path, "wb") as temp_file:
            temp_file.write(await file.read())

        # Convert the .m4a file to .mp3 using pydub
        audio = AudioSegment.from_file(temp_path)
        audio.export(dest_path, format="mp3")

        # Remove the temporary .m4a file
        os.remove(temp_path)

        # Store metadata in the database
        # metadata = AudioMetadata(
        #     filename=sanitized_filename,
        #     upload_timestamp=datetime.utcnow(),
        #     arabic_letter=filename.split("_")[
        #         0
        #     ],  # Assuming the filename contains the Arabic letter
        #     file_path=dest_path,
        #     duration=audio.duration_seconds,
        #     user_session_id=None,  # Add user session ID if applicable
        # )
        # db.add(metadata)
        # db.commit()

        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded, converted to MP3, and saved successfully.",
                "path": dest_path,
            },
        )
    except Exception as e:
        # db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}"
        )
    # finally:
    #     db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="192.168.118.72", port=3000)
# Start the server with `uvicorn main:app --reload`

# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .database import engine, Base, get_db
# from .models import AudioMetadata

# app = FastAPI()

# # Create the database tables
# Base.metadata.create_all(bind=engine)


# @app.post("/audio_metadata")
# def create_audio_metadata(data: dict, db: Session = Depends(get_db)):
#     try:
#         new_record = AudioMetadata(
#             filename=data["filename"],
#             arabic_letter=data["arabic_letter"],
#             file_path=data["file_path"],
#             duration=data["duration"],
#             user_session_id=data.get("user_session_id"),
#         )
#         db.add(new_record)
#         db.commit()
#         db.refresh(new_record)
#         return new_record.to_dict()
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=str(e))


# @app.get("/audio_metadata/{filename}")
# def get_audio_metadata(filename: str, db: Session = Depends(get_db)):
#     record = db.query(AudioMetadata).filter_by(filename=filename).first()
#     if record:
#         return record.to_dict()
#     raise HTTPException(status_code=404, detail="Record not found")


# @app.put("/audio_metadata/{filename}")
# def update_audio_metadata(
#     filename: str, data: dict, db: Session = Depends(get_db)
# ):
#     record = db.query(AudioMetadata).filter_by(filename=filename).first()
#     if record:
#         try:
#             record.arabic_letter = data.get(
#                 "arabic_letter", record.arabic_letter
#             )
#             record.file_path = data.get("file_path", record.file_path)
#             record.duration = data.get("duration", record.duration)
#             record.user_session_id = data.get(
#                 "user_session_id", record.user_session_id
#             )
#             db.commit()
#             db.refresh(record)
#             return record.to_dict()
#         except Exception as e:
#             db.rollback()
#             raise HTTPException(status_code=400, detail=str(e))
#     raise HTTPException(status_code=404, detail="Record not found")


# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="localhost", port=8000)
