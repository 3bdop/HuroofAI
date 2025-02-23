"""Module for speech recognition using ML models and text similarity calculations.

This module provides the SpeechRecognition class which handles speech-to-text
transcription and confidence scoring using Levenshtein distance.
"""

import Levenshtein
import torch

import app.services.ml.model_actions as ma
from app.utils import load_audio


class SpeechRecognition:
    """A class for performing speech recognition using ML models.

    This class handles loading speech recognition models, transcribing audio files,
    and calculating confidence scores for transcriptions.
    """

    def __init__(self, modeldir: str, modelname: str, device: torch.device) -> None:
        """Initialize the SpeechRecognition class.

        Loads the specified speech recognition model and processor.

        Args:
            modeldir (str): The directory containing the model.
            modelname (str): The name of the model.
            device (torch.device): The device to load the model onto.
        """
        self.device = device
        self.model, self.processor = ma.load(modeldir, modelname, device)

    def transcribe(self, wav_file: str) -> str:
        """Transcribe a WAV file.

        Loads the audio from the given WAV file and transcribes it using the loaded
        model.

        Args:
            wav_file (str): The path to the WAV file.

        Returns:
            str: The transcribed text.
        """
        return ma.predict(
            load_audio(wav_file),
            self.model,
            self.processor,
            self.device,
        )

    def calculate_confidence(self, predicted: str, correct: str) -> float:
        """Calculate the confidence score.

        Calculates the Levenshtein distance between the predicted and correct texts
        and returns a confidence score based on the similarity.

        Args:
            predicted (str): The predicted text.
            correct (str): The correct text.

        Returns:
            float: The confidence score (percentage).
        """
        distance = Levenshtein.distance(predicted, correct)
        max_len = max(len(predicted), len(correct))
        similarity = (max_len - distance) / max_len
        return similarity * 100
