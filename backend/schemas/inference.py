from pydantic import BaseModel


class InferenceModel(BaseModel):
    correct: str
    recordpath: str
