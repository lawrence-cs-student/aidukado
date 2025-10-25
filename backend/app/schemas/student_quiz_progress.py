from pydantic import BaseModel
from typing import Dict

class CreateScore(BaseModel):
    student_id: int
    quiz_id: int
    status: str
    score: float
    answers: Dict[int, str]

class ScoreOut(BaseModel):
    id: int
    student_id: int
    quiz_id: int
    status: str
    score: float
    answers: Dict[int, str]
    