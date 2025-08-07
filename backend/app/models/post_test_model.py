from pydantic import BaseModel

class PostTestRequest(BaseModel):
    generatedLesson: str
    origFile: str