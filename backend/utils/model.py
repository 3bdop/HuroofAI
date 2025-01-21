import logging
import os
import sys
from functools import lru_cache
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

root = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(root))
from _save_model import save_model_and_processor

from .buckwalter import bw2ar

logger = logging.getLogger()


@lru_cache(maxsize=1)
def load_model(modeldir, modelname, device) -> tuple:
    modelpath = os.path.join(root, modeldir, modelname)
    processorpath = os.path.join(root, modeldir, f"{modelname}_processor")

    if not os.path.exists(modelpath) or not os.path.exists(processorpath):
        print(
            f"Model or processor not found. saving model `python {root}/_save_model.py`..."
        )
        save_model_and_processor()

    model = Wav2Vec2ForCTC.from_pretrained(modelpath).to(device)
    processor = Wav2Vec2Processor.from_pretrained(processorpath)

    return model, processor


def predict(data, model, processor, device) -> str:
    max_length = 128000
    features = processor(
        data["speech"][:max_length],
        sampling_rate=data["sampling_rate"],
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

    text = "".join([bw2ar[l] if l in bw2ar else l for l in text])
    return text


def warmup_model(model) -> None:
    """Perform a dummy inference to warm up the model"""
    dummy_input = "dummy.wav"

    if not os.path.exists(dummy_input):
        sr = 22050  # Sample rate
        duration = 1.0  # seconds
        silent_audio = np.zeros(int(sr * duration))  # 1 second of silence
        sf.write(dummy_input, silent_audio, sr)
        logging.info(f"Created dummy input file '{dummy_input}'.")

    model.transcribe(dummy_input)
