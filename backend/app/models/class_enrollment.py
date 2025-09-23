

from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ClassEnrollment(Base):
    
    __tablename__ = "class_enrollment"
    
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    enrollment_date = Column(Date, server_default=func.current_date())
    status = Column(String, default="active")
    
    student = relationship("Users", back_populates="class_enrollments")
    enrolled_class = relationship("Classes", back_populates="class_students")