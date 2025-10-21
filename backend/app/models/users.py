from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base
from app import models



class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    middle_name = Column(String(100))
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    
    classes_ = relationship("Classes", back_populates="user_teacher") 
    class_enrollments = relationship("ClassEnrollment", back_populates="student")
    activity_progress = relationship("StudentActivityProgress", back_populates="student")
    submissions = relationship("StudentSubmission", back_populates="student", cascade="all, delete")

    # quiz_progress = relationship("StudentQuizProgress", back_populates="student")