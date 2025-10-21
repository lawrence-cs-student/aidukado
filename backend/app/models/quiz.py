from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


# class Quiz(Base):
#     __tablename__ = "quizzes"

#     id = Column(Integer, primary_key=True, index=True)
#     lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
#     title = Column(String(255), nullable=False)
#     instructions = Column(Text, nullable=True)
#     file_url = Column(String(500), nullable=False)
#     created_at = Column(TIMESTAMP, server_default=func.now())

#     material = relationship("ClassMaterial", back_populates="quizzes")
#     student_progress = relationship("StudentQuizProgress", back_populates="quiz")