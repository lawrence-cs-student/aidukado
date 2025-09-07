from pydantic import BaseModel
from typing import Optional

# Schema for creating a class
class ClassCreate(BaseModel):
    subject_id: int
    teacher_id: int
    name: str

# Schema for updating a class (all fields optional)
class ClassUpdate(BaseModel):
    subject_id: Optional[int] = None
    teacher_id: Optional[int] = None
    name: Optional[str] = None

# Schema for returning class data
class ClassOut(BaseModel):
    id: int
    subject_id: int
    teacher_id: int
    name: str

    class Config:
        from_attributes = True




    