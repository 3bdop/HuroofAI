"""Module for handling ML model operations including loading, prediction, and warmup.

Provides functionality for speech-to-text transcription using Wav2Vec2 models.
"""

import logging
import os
import sys
from functools import lru_cache
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from services.ml.speech_recognition import SpeechRecognition
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

from ._buckwalter import bw2ar
from .save_model import save_model_and_processor

root = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(root))


logger = logging.getLogger()


@lru_cache(maxsize=1)
def load(
    modeldir: str, modelname: str, device: torch.device
) -> tuple[Wav2Vec2ForCTC, Wav2Vec2Processor]:
    """Load the pre-trained model and processor.

    Loads the specified model and processor from the given directory,
    saving them first if they don't already exist.

    Args:
        modeldir (str): The directory containing the model.
        modelname (str): The name of the model.
        device (torch.device): The device to load the model onto.

    Returns:
        tuple: The loaded model and processor.
    """
    modelpath = os.path.join(root, modeldir, modelname)
    processorpath = os.path.join(root, modeldir, f"{modelname}_processor")

    if not os.path.exists(modelpath) or not os.path.exists(processorpath):
        print(
            f"Model or processor not found. saving model `python {root}/_save_model.py`"
        )
        save_model_and_processor()

    model = Wav2Vec2ForCTC.from_pretrained(modelpath).to(device)  # type: ignore
    processor = Wav2Vec2Processor.from_pretrained(processorpath)
    assert isinstance(processor, Wav2Vec2Processor)

    return model, processor


def predict(
    data: dict[str, np.ndarray | int | float],
    model: Wav2Vec2ForCTC,
    processor: Wav2Vec2Processor,
    device: torch.device,
) -> str:
    """Predict the text from the given audio data.

    Performs speech-to-text prediction using the provided model and processor.

    Args:
        data (dict): Dictionary containing the speech data and sampling rate.
        model (Wav2Vec2ForCTC): The pre-trained model.
        processor (Wav2Vec2Processor): The pre-trained processor.
        device (torch.device): The device to run the prediction on.

    Returns:
        str: The predicted text.
    """
    assert isinstance(data["speech"], np.ndarray)
    assert isinstance(data["sampling_rate"], int | float)

    max_length = 128000
    features = processor(
        data["speech"][:max_length],
        sampling_rate=int(data["sampling_rate"]),
        padding=True,
        max_length=max_length,
        pad_to_multiple_of=max_length,
        return_tensors="pt",
    )

    input_values = features.input_values.to(device)

    try:
        attention_mask = features.attention_mask.to(device)
    except Exception:
        attention_mask = None

    with torch.no_grad():
        outputs = model(input_values, attention_mask=attention_mask)

    pred_ids = torch.argmax(outputs.logits, dim=-1)
    text = processor.batch_decode(pred_ids)[0]

    text = "".join([bw2ar[letter] if letter in bw2ar else letter for letter in text])
    return text


def warmup(model: SpeechRecognition) -> None:
    """Perform a dummy inference to warm up the model.

    This function performs a dummy inference using a silent audio file to warm
    up the model.  It creates a dummy WAV file if one doesn't exist and then
    transcribes it.

    Args: model (Wav2Vec2ForCTC): The model to warm up.
    """
    dummy_input = "dummy.wav"

    if not os.path.exists(dummy_input):
        sample_rate = 16_000
        duration = 3.0
        silent_audio = np.zeros(int(sample_rate * duration))  # 3 second of silence
        sf.write(dummy_input, silent_audio, sample_rate)
        logging.info(f"Created dummy input file '{dummy_input}'.")

    model.transcribe(dummy_input)
