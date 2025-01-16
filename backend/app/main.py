from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pydub import AudioSegment
import os
from pathlib import Path
from fastapi.responses import PlainTextResponse


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
@app.get("/hi", response_class=PlainTextResponse)
async def say_hi():
    return "Hello, world!"


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
        # Ensure sanitized filename
        original_filename = os.path.basename(filename)
        sanitized_filename = original_filename.replace(".m4a", ".mp3")
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

        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded, converted to MP3, and saved successfully.",
                "path": dest_path,
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing file: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="192.168.118.72", port=3000)
# Start the server with `uvicorn main:app --reload`
