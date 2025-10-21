from pydantic import BaseModel, ConfigDict
from app.utils.to_camel import to_camel


class SubmissionCreate:
    material_id: int
    student_id: int
    type: str
    
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )