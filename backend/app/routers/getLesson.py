from fastapi import APIRouter, HTTPException, Depends
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.lesson_content import LessonContent
from app.schemas.lesson_content import LessonOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/getLesson/{lessonId}', response_model=LessonOut)
async def get_lesson(lessonId: int, db:Session = Depends(get_db)):
    lesson = db.query(LessonContent).filter(LessonContent.lesson_id == lessonId).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson