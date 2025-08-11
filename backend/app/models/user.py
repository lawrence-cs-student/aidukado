from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.dialects.postgresql import JSONB

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String)
    first_name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    