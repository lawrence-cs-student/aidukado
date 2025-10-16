from fastapi import APIRouter, HTTPException, Depends, Form, Request
from ..utils.generate_summary import generate_summary


router = APIRouter()

@router.post("/getSummary")
async def upload(request: Request):
    lesson = await request.body()
    lesson =lesson.decode('utf-8')
    
    summary = generate_summary(lesson)  
    print(lesson)  
    print(summary)
    return {"summary": summary}