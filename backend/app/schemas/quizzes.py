from pydantic import BaseModel
from typing import Any
from datetime import datetime

class CreateQuiz(BaseModel):
    lesson_id: int
    title: str
    description: str
    total_points: int
    instruction: str
    quiz_content: Any
    start_time: datetime
    duration: int

class QuizOut(BaseModel):
    id: int
    lesson_id: int
    title: str
    description: str
    total_points: int
    instruction: str
    quiz_content: Any
    start_time: datetime
    duration: int
    