

from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base

class Term(Base):
    __tablename__ = "terms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    
    lessons = relationship("Lesson", back_populates="term")
    
