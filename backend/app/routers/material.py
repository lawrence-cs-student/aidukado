
from fastapi import APIRouter, HTTPException, Depends, File, Form, UploadFile
from typing import List
from sqlalchemy.orm import Session, load_only
from app.database import SessionLocal
import json
from app.schemas.material import MaterialCreate, MaterialOut, MaterialTitleOut
from app.utils.r2_helper import upload_file, generate_presigned_url
from app.utils.extract_text_from_file import extract_text_from_file
from app.models import ClassMaterial, LessonContent, Classes


router = APIRouter(prefix="/class_material", tags=["class_material"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/upload")
async def upload_material(metadata: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    try:
        metadata_dict = json.loads(metadata)

        material_data = MaterialCreate(
            class_id=metadata_dict["classId"],
            term_id=metadata_dict["termId"],
            title=metadata_dict["title"],
            description=metadata_dict["description"],
            type=metadata_dict["type"],
            total_score=metadata_dict["totalScore"]
        )

        file_bytes = await file.read()

        folder = material_data.type
        file_key = upload_file(file_bytes, file.filename, folder)

        material = ClassMaterial(
            class_id=material_data.class_id,
            term_id=material_data.term_id,
            title=material_data.title,
            description=material_data.description,
            file_url=file_key,
            type=material_data.type,
            total_score=material_data.total_score
        )

        db.add(material)
        db.flush()  
        
        if material_data.type == "lesson":
            try:
                extracted_content = extract_text_from_file(file_bytes, file.filename)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"File extraction failed: {e}")

            content = LessonContent(
                material_id=material.id,
                extracted_content=extracted_content
            )

            db.add(content)

        db.commit()
        db.refresh(material)

        return {"message": "Material uploaded successfully", "material_id": material.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/getByClassId/{class_id}", response_model=list[MaterialTitleOut])
def get_lessons_by_class(class_id: int, db: Session = Depends(get_db)):
    
    class_exist = db.query(Classes).filter(Classes.id == class_id).first()
    
    if not class_exist:
        raise HTTPException(
            status_code=404,
            detail=f"Class with ID {class_id} not found."
        )
        
    lessons = (
        db.query(ClassMaterial)
        .options(load_only(ClassMaterial.id, ClassMaterial.title, ClassMaterial.term_id, ClassMaterial.type, ClassMaterial.created_at))
        .filter(ClassMaterial.class_id == class_id)
        .order_by(ClassMaterial.id.desc())
        .all()
    )

    return [MaterialTitleOut.model_validate(lesson) for lesson in lessons]
        
    
@router.get("/getLessonById/{lesson_id}", response_model=MaterialOut, response_model_by_alias=True)
def get_lesson_by_id(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(ClassMaterial).filter(ClassMaterial.id == lesson_id).first()
        
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not Found")
    
    if not lesson.file_url:
        raise HTTPException(status_code=400, detail="Lesson has no file URL")
    
    file_key = lesson.file_url
    file_url = generate_presigned_url(file_key)
    print(file_key)
    
    return {
        "title": lesson.title,
        "description": lesson.description,
        "file_key": file_key,
        "file_url": file_url,
        "type": lesson.type,
        "due_date": lesson.due_date,
        "total_score": lesson.total_score
    }

# @router.patch("/editLesson")
# def edit_lesson(lesson_id: int, db: Session = Depends(get_db)):
#     lesson = db.query(ClassMaterial).filter(ClassMaterial.id == lesson_id).first()
    
#     if not lesson:
#         raise HTTPException(status_code=404, detail="Lesson not existing")
    
    