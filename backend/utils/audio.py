import librosa


def load_audio(file, srate=16_000):
    batch = {}
    speech, sampling_rate = librosa.load(file, sr=srate)
    batch["speech"] = speech
    batch["sampling_rate"] = sampling_rate
    return batch
