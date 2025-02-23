# Huroof App Backend API

A FastAPI-based backend service for processing and evaluating Arabic letter pronunciations using AI-powered speech recognition.

## Overview

The Huroof App Backend provides a REST API for processing Arabic letter pronunciation using Wav2Vec2 model. It handles audio file uploads, performs speech recognition, and evaluates pronunciation accuracy.

## Features

- Speech recognition using fine-tuned Wav2Vec2 model
- Real-time audio processing and evaluation
- Confidence scoring with Levenshtein distance
- Arabic letter pronunciation assessment
- Caching for model optimization
- Async file handling

## Prerequisites

- Python 3.12+
- CUDA-capable GPU (optional, for faster inference)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/huroof-backend.git
cd huroof-backend
```

1. Install dependencies using uv:

```bash
uv sync
```

1. Create `.env` file:

```ini
SERVER_IP=0.0.0.0
SERVER_PORT=8000
MODEL_DIR=models
MODEL_NAME=wav2vec2_arabic
MODEL_CONFIDENCE_THRESHOLD=50.0
```

1. Start the server:

```bash
uv run server.py
```

## API Documentation

### POST `/uploads`

Upload and process audio recordings.

**Request:**

- Content-Type: `multipart/form-data`
- Body:
  - `recording`: Audio file (WAV format)
  - `correct`: Expected Arabic letter

**Response:**

```json
{
    "message": "File uploaded successfully",
    "filename": "uuid.wav",
    "is_correct": true,
    "inference_result": {
        "predicted_text": "ب",
        "confidence": 95.5,
        "is_correct": true
    }
}
```

### POST `/inferences`

Internal endpoint for model inference.

## Project Structure

```plaintext
├── api/            # API routes and endpoints
├── core/           # Core configuration
├── models/         # AI model files
├── schemas/        # Pydantic models
├── services/       # Business logic
└── utils/          # Utility functions
```

## Configuration

Configuration is managed through environment variables and `core/config.py`:

| Variable | Description | Default |
|----------|-------------|---------|
| SERVER_IP | Server IP address | Required |
| SERVER_PORT | Server port | Required |
| MODEL_DIR | Model directory | "models" |
| MODEL_NAME | Model name | "wav2vec2_arabic" |
| MODEL_CONFIDENCE_THRESHOLD | Minimum confidence score | 50.0 |

## Development

### Code Style

- Black formatter with line length 79
- isort for import sorting
- Type hints enforced

### Testing

```bash
pytest
```

### Logging

- Structured logging with custom formatter
- Log files stored in `app.log`
- Configurable log levels

## Performance Considerations

- Model caching using `@lru_cache`
- Async file operations
- GPU acceleration when available

## Security Notes

- File size limits enforced
- Temporary file cleanup
- Input validation using Pydantic
