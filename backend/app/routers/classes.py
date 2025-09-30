from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.database import SessionLocal
from app.models.classes import Classes
from app.schemas.classes import ClassCreate, ClassUpdate, ClassOut, ClassWithTeacherOut

router = APIRouter(prefix="/classes", tags=["classes"])

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()



@router.get("/get", response_model=list[ClassOut])
def get_classes(query: str | None = None, db: Session = Depends(get_db)):
    
    classes = db.query(Classes)
    
    if query:
        classes = classes.filter(Classes.name.ilike(f"%{query}%"))

    classes = classes.order_by(Classes.id.asc()).all()

    return classes

@router.get("/getById/{class_id}", response_model=ClassOut)
def get_user_by_id(class_id: int , db: Session = Depends(get_db)):
    new_class = db.query(Classes).filter(Classes.id == class_id).first()
    
    if not new_class:
        return HTTPException(status_code=404, detail="class not found")
        
    return new_class

@router.get("/getByUserId/{teacher_id}", response_model=list[ClassWithTeacherOut])
def get_classes_by_user_id(teacher_id: int, db: Session = Depends(get_db)):
    classes = (
        db.query(Classes)
        .options(joinedload(Classes.user_teacher))  
        .filter(Classes.teacher_id == teacher_id)
        .all()
    )

    if not classes:
        raise HTTPException(status_code=404, detail="No classes found for this teacher")

    return classes


@router.post("/create")
def create_class(class_data:ClassCreate, db: Session = Depends(get_db)):

    new_class = Classes(
        subject_id = class_data.subject_id,
        teacher_id = class_data.teacher_id,
        name = class_data.name
    )
    
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    
    return{"message": "Class Created Successfully"}

# @router.put("/update/{class_id}")
# def update_class(class_id:int, class_data:ClassCreate, db: Session = Depends(get_db)):
#     class_ = db.query(Classes).filter(Classes.id == class_id).first()

#     if not class_:
#         return {"message": "Class not found"}

#     class_.name = class_data.name
#     class_.subject_id = class_data.subject_id
#     class_.teacher_id = class_data.teacher_id
    
#     db.commit()
#     db.refresh(class_)
    
#     return {"message": "Class updated successfully"}


@router.patch("/patch/{class_id}")
def patch_class(class_id : int, class_update: ClassUpdate, db: Session = Depends(get_db)):
    class_to_update = db.query(Classes).filter(Classes.id == class_id).first()
    
    if not class_to_update:
        raise HTTPException(status_code=404, detail="Class not Found")
    
    for key, value in class_update.model_dump(exclude_unset=True).items():
        setattr(class_to_update, key, value)
        
    db.commit()
    db.refresh(class_to_update)
    
    return {"message" : f"Class with id ${class_id} has been updated successfully"}

@router.delete("/delete/{class_id}")
def delete_class(class_id : int, db: Session = Depends(get_db)):
    classes = db.query(Classes).filter(Classes.id == class_id).first() 
    
    
    if not classes:
        raise HTTPException(status_code=404, detail="Class not Existing")
    
    db.delete(classes)
    db.commit()
    return {"message" : f"user with {class_id} deleted successfully"}

