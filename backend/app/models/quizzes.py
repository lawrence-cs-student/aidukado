from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, func, JSON, DateTime
from app.database import Base


class Quizzes(Base):
    __tablename__ = "quiz"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(255))
    total_points = Column(Integer)
    instruction = Column(Text, nullable=True)
    quiz_content = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 

    