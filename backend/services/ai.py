import Levenshtein
from utils import load_audio, load_model, predict


class SpeechRecognition:
    def __init__(self, modeldir: str, modelname: str, device):
        self.device = device
        self.model, self.processor = load_model(modeldir, modelname, device)

    def transcribe(self, wav_file: str) -> str:
        return predict(
            load_audio(wav_file),
            self.model,
            self.processor,
            self.device,
        )

    def calculate_confidence(self, predicted: str, correct: str) -> float:
        distance = Levenshtein.distance(predicted, correct)
        max_len = max(len(predicted), len(correct))
        similarity = (max_len - distance) / max_len
        return similarity * 100
