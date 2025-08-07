from fastapi import APIRouter, HTTPException
from ..utils.generate_lesson import generate_lesson
from ..models.question_model import QuestionItem
from typing import List

router = APIRouter()

@router.post("/generate_lesson")

async def lesson(questions : List[QuestionItem]):
    
    question_dicts = [q.dict() for q in questions]
    
    generated_lesson = generate_lesson(question_dicts)

    return {"lesson" : generated_lesson}
