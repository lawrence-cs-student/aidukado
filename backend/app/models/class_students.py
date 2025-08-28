

from sqlalchemy import Column, Integer
from sqlalchemy.orm import relationship
from app.database import Base


class ClassStudents(Base):
    
    __tablename__ = "class_students"
    
    class_id = Column(Integer, ForeignKey="classes.id")
    student_id = Column(Integer, ForeignKey="user.id")
    
    # students = relationship("User", back_populates="class_enrollments")
    # classes_ = relationship("Classes", back_populates="class_students")