"""Module for saving pre-trained Wav2Vec2 model and processor from Hugging Face Hub."""

import logging
from pathlib import Path

from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

HUB = "elgeish/wav2vec2-large-xlsr-53-arabic"
MODEL_DIR = Path("models")
MODEL_NAME = "wav2vec2_arabic"


def save_model_and_processor() -> None:
    """Save the pre-trained model and processor.

    Downloads and saves the pre-trained Wav2Vec2 model and processor from the Hugging
    Face Hub to the specified directory.
    """
    try:
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        logger.info(f"Created directory: {MODEL_DIR}")

        logger.info(f"Downloading model from {HUB}...")
        model = Wav2Vec2ForCTC.from_pretrained(HUB)
        model_path = MODEL_DIR / MODEL_NAME
        model.save_pretrained(str(model_path))
        logger.info(f"Model saved to {model_path}")

        logger.info(f"Downloading processor from {HUB}...")
        processor = Wav2Vec2Processor.from_pretrained(HUB)
        processor_path = MODEL_DIR / f"{MODEL_NAME}_processor"
        processor.save_pretrained(str(processor_path))  # type: ignore
        logger.info(f"Processor saved to {processor_path}")

        logger.info("Model and processor saved successfully!")

    except Exception as e:
        logger.error(
            f"An error occurred while saving the model and processor: {str(e)}"
        )
        raise


if __name__ == "__main__":
    save_model_and_processor()
