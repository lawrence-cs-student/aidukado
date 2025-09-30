
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Classes(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    
    # subject_of_class = relationship("Subjects", back_populates= "")
    # lessons = relationship("UploadedLessons", back_populates="classes_")
    user_teacher = relationship("Users", back_populates="classes_")
    class_students = relationship("ClassEnrollment", back_populates="enrolled_class")
    lessons = relationship("Lesson", back_populates="class_")
    