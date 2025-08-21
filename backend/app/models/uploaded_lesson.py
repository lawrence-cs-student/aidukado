
from sqlalchemy import Column, String, Text, TIMESTAMP, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UploadedLessons(Base):
    __tablename__ = "upload_lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(Text, nullable=False, )
    extracted_content = Column(JSON, )
    uploaded_at = Column(TIMESTAMP, server_default=func.now())
    file_name = Column(Text, nullable=False,)
    class_id = Column(Integer, ForeignKey = "classes.id", nullable=False)
    
    class_ = relationship("Classes", back_populates="lessons")
    
    
    