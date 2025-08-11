from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.database import SessionLocal
from app.utils.auth import hash_password

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()

@router.post ("/signup")
def signup(user:UserCreate, db: Session = Depends(get_db)):
    password = hash_password(user.password)

    new_user = User(
        last_name = user.last_name,
        first_name = user.first_name,
        email = user.email,
        password = password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(user)
    return{"message": "User Created Successfully"}