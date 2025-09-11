
from pydantic import BaseModel

class SubjectCreate(BaseModel):
    name: str
    description:str

class SubjectOut(BaseModel):
    id: int
    name: str
    description: str
    
    
    class Config:
        from_attributes = True
    
class SubjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    
    
