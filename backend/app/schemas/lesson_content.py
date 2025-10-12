from pydantic import BaseModel

class LessonOut(BaseModel):
    lesson_id: int
    lesson_content: str

    class Config:
        orm_mode = True