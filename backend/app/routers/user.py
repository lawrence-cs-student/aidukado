from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models import Users, ClassEnrollment
from app.schemas.user import UserCreate, UserOut, UserUpdate, TeacherOut
from app.database import SessionLocal
from app.utils.auth import hash_password

router = APIRouter(prefix="/user", tags=["user"])

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()


@router.get("/get", response_model=list[UserOut])
def get_users(query: str | None = None, db: Session = Depends(get_db)):
    
    users_query = db.query(Users)
    
    if query:
        users_query = users_query.filter(
            or_(
                Users.first_name.ilike(f"%{query}%"),
                Users.last_name.ilike(f"%{query}%"),
                Users.email.ilike(f"%{query}%")
            )
        )
        
    users= users_query.order_by(Users.id.asc()).all()

    return users


@router.get("/getById/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int , db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
        
    return user

@router.get("/get_teachers", response_model=list[TeacherOut])
def get_all_teachers(db: Session = Depends(get_db)):
    teachers = db.query(Users).filter(Users.role == "teacher").all()
    
    return teachers

@router.get("/get_students", response_model=list[UserOut])
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(Users).filter(Users.role == "student").all()
    
    return students

@router.post("/batch_create")
def create_multiple_users(users: list[UserCreate], db: Session = Depends(get_db)):
   
    try:
        for user in users:
            password = hash_password(user.password)
        
            new_user = Users(
                last_name = user.last_name,
                first_name = user.first_name,
                middle_name = user.middle_name,
                email = user.email,
                password_hash = password,
                role = "student"
            )
            db.add(new_user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {"message" : "Users Registered Successfully"}

@router.post("/create")
def create_user(user:UserCreate, db: Session = Depends(get_db)):
    password = hash_password(user.password)

    new_user = Users(
        last_name = user.last_name,
        first_name = user.first_name,
        middle_name = user.middle_name,
        email = user.email,
        password_hash = password,
        role = user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    
    return{"message": "User Created Successfully"}

@router.patch("/patch/{user_id}")
def patch_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not existing")
    
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)
        
    db.commit()
    db.refresh(user)

    return {"message" : f"user with {user_id} updated successfully"}

@router.delete("/delete/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")


    existing_enrollments = db.query(ClassEnrollment).filter_by(student_id=user_id).first()
    if existing_enrollments:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete user: existing enrollments found."
        )

    db.delete(user)
    db.commit()
    return {"message": f"User with ID {user_id} deleted successfully"}


