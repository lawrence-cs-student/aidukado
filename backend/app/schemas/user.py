from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    last_name: str
    first_name: str
    email: EmailStr
    password: str