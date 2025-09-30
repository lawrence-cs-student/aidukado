from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from datetime import timedelta
from sqlalchemy.orm import Session
from app.models.user import Users
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.database import get_db
from app.utils.auth import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTPP_400_BAD_REQUEST,
            detail="email already existing"
        )
        
    hashed_pw = hash_password(user.password)
    
    db_user = Users (
        email=user.email,
        password_hash=hashed_pw,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name
    )
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token_expires = timedelta(minutes=30)
    refresh_token_expires = timedelta(days=7)

   
    payload = {
        "sub": str(db_user.id),   
        "role": db_user.role
    }

    access_token = create_access_token(payload, access_token_expires)
    refresh_token = create_access_token(payload, refresh_token_expires)

    
    response_body = {
        "message": "Login Successful",
        "id": db_user.id,
        "role": db_user.role
    }

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,   
        samesite="Strict",
        max_age=int(access_token_expires.total_seconds())
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,   # ⚠️ set to True in production
        samesite="Strict",
        max_age=int(refresh_token_expires.total_seconds())
    )

    return JSONResponse(content=response_body)

    
    
@router.post("/refresh", response_model=TokenResponse)
def refresh_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    new_access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=30)
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }