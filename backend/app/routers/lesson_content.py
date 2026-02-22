from fastapi import APIRouter, Depends, HTTPException, Form
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.lesson_content import LessonContent
from app.schemas.lesson_content import LessonOut
from ..utils.generate_summary import generate_summary
from app.database import get_db

router = APIRouter()



@router.get('/getLesson/{materialId}', response_model = LessonOut)
def get_lesson(materialId: int, db:Session = Depends(get_db)):
    
    lesson = db.query(LessonContent).filter(LessonContent.material_id == materialId).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson

@router.post("/generateSummary")
async def generate_summary_endpoint(
    material_id: int = Form(...),
    lesson_content: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Generate or retrieve a lesson summary.
    Returns existing summary if already generated, otherwise generates new one.
    """
    
    lesson = db.query(LessonContent).filter(LessonContent.material_id == material_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if summary was previously generated
    if lesson.summary is not None:
        return {
            "status": "retrieved",
            "message": "Using previously generated summary",
            "material_id": material_id,
            "summary": lesson.summary,
            "generated_new": False
        }
    
    # Generate new summary
    generated_summary = await generate_summary(lesson_content)
    
    # Save to database (primary storage)
    lesson.summary = generated_summary
    print ("generated sumary:", generated_summary)
    db.commit()
    
    return {
        "status": "generated",
        "message": "New summary generated",
        "material_id": material_id,
        "summary": generated_summary,
        "generated_new": True
    }



