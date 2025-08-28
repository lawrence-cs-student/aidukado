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
        
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token : str
    token_type: str = "bearer"



    