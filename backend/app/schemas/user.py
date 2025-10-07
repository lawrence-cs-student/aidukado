from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import ConfigDict  



def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    first_name: str 
    last_name: str 
    middle_name: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        **{"extra": "allow"}
    )


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    first_name: str 
    last_name: str 
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
        

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
    
class TeacherOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )

        

class UserUpdate(BaseModel):
    email: str | None = None
    role: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    middle_name: str | None = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
        

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
    

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )
