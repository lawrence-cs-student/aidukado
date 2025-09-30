from pydantic import BaseModel

class LessonCreate(BaseModel):
    class_id: int
    term_id: int
    title: str
    description: str
    