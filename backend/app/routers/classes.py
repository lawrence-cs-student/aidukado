from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import SessionLocal
from app.models.classes import Classes
from app.schemas.classes import ClassCreate, ClassUpdate

router = APIRouter(prefix="/classes", tags=["classes"])

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()


# @router.get("/getById", response_model=UserOut)
# def get_user_by_id(user_id: int , db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
    
#     if not user:
#         return HTTPException(status_code=404, detail="user not found")
        
#     return user

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
    
    return{"message": "class Created Successfully"}

@router.put("/update/{class_id}")
def update_class(class_id:int, class_data:ClassCreate, db: Session = Depends(get_db)):
    class_ = db.query(Classes).filter(Classes.id == class_id).first()

    if not class_:
        return {"message": "Class not found"}

    class_.name = class_data.name
    class_.subject_id = class_data.subject_id
    class_.teacher_id = class_data.teacher_id
    
    db.commit()
    db.refresh(class_)
    
    return {"message": "Class updated successfully"}




@router.delete("/delete/{class_id}")
def delete_class(class_id : int, db: Session = Depends(get_db)):
    classes = db.query(Classes).filter(Classes.id == class_id).first() 
    
    
    if not classes:
        return {"message" : "User not existing"}
    
    db.delete(classes)
    db.commit()
    return {"message" : f"user with {class_id} deleted successfully"}