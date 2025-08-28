from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
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
    
    users_query = db.query(User)
    
    if query:
        users_query = users_query.filter(
            or_(
                User.first_name.ilike(f"%{query}%"),
                User.last_name.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        )
        
    users= users_query.all()

    return users


# @router.get("/getById", response_model=UserOut)
# def get_user_by_id(user_id: int , db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
    
#     if not user:
#         return HTTPException(status_code=404, detail="user not found")
        
#     return user

@router.post("/create")
def create_user(user:UserCreate, db: Session = Depends(get_db)):
    password = hash_password(user.password)

    new_user = User(
        last_name = user.last_name,
        first_name = user.first_name,
        middlename = user.middlename,
        email = user.email,
        password_hash = password,
        role = user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(user)
    
    return{"message": "User Created Successfully"}


@router.delete("/delete/{user_id}")
def delete_user(user_id : int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    
    
    if not user:
        return {"message" : "User not existing"}
    
    db.delete(User)
    db.commit
    return {"message" : f"user with {user_id} deleted successfully"}