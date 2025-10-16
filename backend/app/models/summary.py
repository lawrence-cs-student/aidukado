from sqlalchemy import Column, Integer, String, Numeric, DateTime, func
from app.database import Base

class Score(Base):
    __tablename__='lesson_summaries'

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer)
    summary = Column(String)