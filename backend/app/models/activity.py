
from sqlalchemy import Column, Integer, ForeignKey, String, Text, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    lesson = relationship("Lesson", back_populates="activities")
    
    student_progress = relationship("StudentActivityProgress", back_populates="activity")