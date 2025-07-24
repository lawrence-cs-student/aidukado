from fastapi import APIRouter, HTTPException
from ..utils.generate_lesson import generate_lesson
from ..models.question_model import QuestionItem
from typing import List

router = APIRouter()

@router.post("/generate_lesson")

async def generate_lesson(questions : List[QuestionItem]):
    generated_lesson = generate_lesson(questions)

    return {"lesson" : generated_lesson}
