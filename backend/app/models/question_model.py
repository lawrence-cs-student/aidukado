from pydantic import BaseModel
from typing import List


class QuestionItem(BaseModel):
    question : str
    options : List[str]
    answer : str
    user_answer: str
