

from sqlalchemy import Column, Integer, String, func, TIMESTAMP, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class ClassMaterial(Base):
    __tablename__ = "class_materials"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    term_id = Column(Integer, ForeignKey("terms.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(TIMESTAMP, nullable=True)
    type = Column(String(50), nullable=False)  
    total_score = Column(Integer, nullable=True)
    file_url = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    class_ = relationship("Classes", back_populates="materials")
    term = relationship("Term", back_populates="materials")
    content = relationship("LessonContent", back_populates="material", uselist=False, cascade="all, delete")

    student_progress = relationship("StudentActivityProgress", back_populates="material")
    submissions = relationship("StudentSubmission", back_populates="material", cascade="all, delete")

    # activities = relationship("Activity", back_populates="lesson", cascade="all, delete")
    quizzes = relationship("Quiz", back_populates="material", cascade="all, delete")
    
