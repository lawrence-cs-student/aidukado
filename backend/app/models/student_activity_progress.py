
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class StudentActivityProgress(Base):
    __tablename__ = "student_activity_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_id = Column(Integer, ForeignKey("class_materials.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)
    score = Column(Integer, nullable=True)

    # Relationships
    student = relationship("Users", back_populates="activity_progress")
    material = relationship("ClassMaterial", back_populates="student_progress")
