from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    first_name: str 
    last_name: str 
    middlename: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    first_name: str 
    last_name: str 
    
    class Config:
        from_attributes = True
        
class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    first_name: str
    last_name: str
    middlename: Optional[str] = None
    
    class Config:
        from_attributes = True
        
class UserUpdate(BaseModel):
    email: str | None = None
    role: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    middlename: str | None = None
        
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token : str
    token_type: str = "bearer"
    
    




    