

from sqlalchemy import Column, Integer, String, func, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    term_id = Column(Integer, ForeignKey("terms.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    class_ = relationship("Classes", back_populates="lessons")
    term = relationship("Term", back_populates="lessons")
    activities = relationship("Activity", back_populates="lesson", cascade="all, delete")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete")