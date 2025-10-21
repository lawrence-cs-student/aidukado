from pydantic import BaseModel, ConfigDict
from app.utils.to_camel import to_camel
from typing import Optional
from datetime import datetime

class MaterialCreate(BaseModel):
    class_id: int
    term_id: int
    title: str
    description: Optional[str] = None
    type: str                     
    total_score: Optional[int] = None
    due_date: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )


class MaterialOut(BaseModel):
    title: str
    description: Optional[str]
    type: str
    total_score: Optional[int]
    file_url: str
    file_key: str
    due_date: Optional[datetime]

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )


class MaterialTitleOut(BaseModel):
    id: int
    title: str
    term_id: int
    created_at: datetime
    type: str
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )