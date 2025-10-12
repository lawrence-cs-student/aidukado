from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class LessonContent(Base):
    __tablename__ = "lesson_content"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer)
    lesson_content = Column(String)