
# from fastapi import APIRouter, HTTPException
# from ..utils.generate_lesson import generate_lesson
# from ..models.question_model import QuestionItem
# from typing import List

# router = APIRouter()

# @router.post("/generate_lesson")

# async def lesson(questions : List[QuestionItem]):
    
#     question_dicts = [q.dict() for q in questions]
    
#     generated_lesson = generate_lesson(question_dicts)

#     return {"lesson" : generated_lesson}


# from fastapi import APIRouter, HTTPException, Depends, Form, UploadFile
# from typing import List
# from sqlalchemy.orm import Session
# from app.database import SessionLocal
# import json
# from app.schemas.lesson import LessonCreate
# from app.utils.r2_helper import upload_file
# from app.models.lesson import Lesson

# router = APIRouter(prefix="/lesson", tags=["leson"])


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
        

# def upload_lesson(metadata: str = Form(...), file: UploadFile = Form(...), db: Session = Depends(get_db)):
    
#     lesson_data= LessonCreate(**json.loads(metadata))
    
#     file_key= upload_file(file, "lessons")
    
#     lesson = Lesson(
#         class_id= lesson_data.class_id,
#         term_id= lesson_data.term_id,
#         title = lesson_data.title,
#         description= lesson_data.description,
#         file_url= file_key
#     )
    

#     db.add(lesson)
#     db.commit()
#     db.refresh(lesson)