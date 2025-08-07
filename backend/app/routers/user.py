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
    user_data = user.dict()
    user_data['password'] = hash_password(user_data['password'])

    new_user = User(data=user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(user)
    return{"message": "User Created Successfully"}