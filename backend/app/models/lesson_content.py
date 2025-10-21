from sqlalchemy import Column, Integer, Text, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class LessonContent(Base):
    __tablename__ = "lesson_contents"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("class_materials.id", ondelete="CASCADE"), nullable=False)
    extracted_content = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

    material = relationship("ClassMaterial", back_populates="content")
