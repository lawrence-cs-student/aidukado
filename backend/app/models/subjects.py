
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base


class Subjects(Base):
    
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())