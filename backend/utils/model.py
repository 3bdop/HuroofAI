import logging
import os
from functools import lru_cache

import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

from .buckwalter import bw2ar

logger = logging.getLogger()
from pathlib import Path

root = Path(__file__).resolve().parent.parent.parent


@lru_cache(maxsize=1)
def load_model(modeldir, modelname, device) -> tuple:
    modelpath = os.path.join(root, modeldir, modelname)
    processorpath = os.path.join(root, modeldir, f"{modelname}_processor")

    if not os.path.exists(modelpath) or not os.path.exists(processorpath):
        raise FileNotFoundError(
            f"Model or processor not found. Please run {root}/_save_model.py first."
        )

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
