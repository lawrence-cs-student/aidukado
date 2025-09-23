
    
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date
from app.schemas.classes import ClassWithTeacherOut


def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

class EnrollmentCreate(BaseModel):
    class_id: int
    student_id: int
    status: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True  
    )

class EnrollmentOut(BaseModel):
    id: int
    class_id: int
    student_id: int
    enrollment_date: date
    status: str

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
    
class EnrollmentClassOut(BaseModel):
    id: int
    enrolled_class: ClassWithTeacherOut
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )

class EnrollmentUpdate(BaseModel):
    class_id: Optional[int] = None
    student_id: Optional[int] = None
    status: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

