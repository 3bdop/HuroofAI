"""Audio loading utilities.

This module provides functions for loading and processing audio files.
"""

import librosa
from numpy.typing import NDArray


def load_audio(
    file: str, sample_rate: int = 16_000
) -> dict[str, NDArray | int | float]:
    """Load audio from a file.

    Loads audio data from the specified file using the given sample rate.

    Args:
        file: Path to the audio file.
        sample_rate: The sample rate to use when loading the audio.

    Returns:
        A dictionary containing the loaded speech and sampling rate.
    """
    speech, sampling_rate = librosa.load(file, sr=sample_rate)
    return {"speech": speech, "sampling_rate": sampling_rate}
