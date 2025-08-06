from sqlalchemy import Column, Integer
from app.database import Base
from sqlalchemy.dialects.postgresql import JSONB

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(JSONB, nullable=False)