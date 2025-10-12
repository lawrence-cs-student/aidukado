from pydantic import BaseModel
from typing import Any

class CreateQuiz(BaseModel):
    lesson_id: int
    title: str
    description: str
    total_points: int
    instruction: str
    quiz_content: Any

class QuizOut(BaseModel):
    id: int
    lesson_id: int
    title: str
    description: str
    total_points: int
    instruction: str
    quiz_content: Any
    