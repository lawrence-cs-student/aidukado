from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.utils.to_camel import to_camel   
from app.schemas.user import TeacherOut
from app.schemas.subject import SubjectOut

class ClassCreate(BaseModel):
    subject_id: int
    teacher_id: int
    name: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class ClassUpdate(BaseModel):
    subject_id: Optional[int] = None
    teacher_id: Optional[int] = None
    name: Optional[str] = None

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )


class ClassOut(BaseModel):
    id: int
    name: str
    subject: SubjectOut
    user_teacher: TeacherOut

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
    
class ClassWithTeacherOut(BaseModel):
    id: int
    name: str
    user_teacher: TeacherOut
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
        
