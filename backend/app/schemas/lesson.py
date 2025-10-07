from pydantic import BaseModel, ConfigDict
from app.utils import to_camel

class LessonCreate(BaseModel):
    class_id: int
    term_id: int
    title: str
    description: str
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )