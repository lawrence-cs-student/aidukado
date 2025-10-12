from sqlalchemy import Column, Integer, String, Numeric, DateTime, func
from app.database import Base

class Score(Base):
    __tablename__='scores'

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    test_type = Column(String)
    test_id = Column(Integer)
    score = Column(Numeric(5, 2))
    taken_at = Column(DateTime(timezone=True), server_default=func.now())