from pydantic import BaseModel

class CreateScore(BaseModel):
    student_id: int
    test_type: str
    test_id: int
    score: float

