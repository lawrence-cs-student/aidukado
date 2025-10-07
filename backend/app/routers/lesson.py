
# from fastapi import APIRouter, HTTPException
# from ..utils.generate_lesson import generate_lesson
# from ..models.question_model import QuestionItem
# from typing import List

# router = APIRouter(prefix="/lesson", tags=["lesson"])

# @router.post("/generate_lesson")

# async def lesson(questions : List[QuestionItem]):
    
#     question_dicts = [q.dict() for q in questions]
    
#     generated_lesson = generate_lesson(question_dicts)

#     return {"lesson" : generated_lesson}


from fastapi import APIRouter, HTTPException, Depends, File, Form, UploadFile
from typing import List
from sqlalchemy.orm import Session
from app.database import SessionLocal
import json
from app.schemas.lesson import LessonCreate
from app.utils.r2_helper import upload_file
from app.models.lesson import Lesson

router = APIRouter(prefix="/lesson", tags=["lesson"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/upload")
async def upload_lesson(metadata: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    print(json.loads(metadata))
    try:
        metadata_dict = json.loads(metadata)
        
        lesson_data = LessonCreate(
            class_id=metadata_dict["classId"],
            term_id=metadata_dict["termId"],
            title=metadata_dict["title"],
            description=metadata_dict["description"]
        )
        
        print("PARSED LESSON DATA:", lesson_data)
    
        file_key= upload_file(file, "lessons")
        
        lesson = Lesson(
            class_id= lesson_data.class_id,
            term_id= lesson_data.term_id,
            title = lesson_data.title,
            description= lesson_data.description,
            file_url= file_key
        )
        

        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail= str(e))