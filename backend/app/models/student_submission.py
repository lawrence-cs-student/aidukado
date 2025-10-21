
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class StudentSubmission(Base):
    __tablename__ = "student_submissions"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("class_materials.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(Text, nullable=False)
    submitted_at = Column(TIMESTAMP, server_default=func.now())
    score = Column(Integer, nullable=True)
    remarks = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="submitted")

    # Relationships
    material = relationship("ClassMaterial", back_populates="submissions")
    student = relationship("Users", back_populates="submissions")
