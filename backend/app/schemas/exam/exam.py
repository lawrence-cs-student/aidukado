
from pydantic import BaseModel
from typing import List, Any, Optional, Dict
from datetime import datetime

class LessonHour(BaseModel):
    lesson_id: int
    title: str
    hours: float

class TOSRequest(BaseModel):
    lessons: List[LessonHour]
    total_items: int
    
    
from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import List, Any, Optional

from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, validator, Field
import json

class CreateExam(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    total_points: int = Field(..., gt=0)
    instructions: str = ""
    exam_content: Optional[Dict] = None  # Changed from Any to Dict
    duration: int = Field(..., ge=15, le=90)
    class_id: int
    term_id: int
    is_archive: bool = False
    passing_score: Optional[int] = None
    shuffle_questions: bool = False
    assigned_students: Optional[List[int]] = []
    class_material_ids: Optional[List[int]] = []
    lesson_ids: List[int] = []
    closing_time: datetime
    opening_time: datetime
    
    @validator('closing_time', pre=True)
    def parse_closing_time(cls, value):
        if isinstance(value, str):
            # Handle the datetime string format from frontend
            try:
                # Remove timezone if present and parse
                if 'T' in value:
                    # Format: "2024-01-01T23:59"
                    if 'Z' in value:
                        value = value.replace('Z', '+00:00')
                    elif '+' not in value and '-' not in value[-6:]:
                        # No timezone info, assume local
                        value = value + '+00:00'
                return datetime.fromisoformat(value)
            except ValueError:
                try:
                    return datetime.strptime(value, '%Y-%m-%dT%H:%M')
                except ValueError:
                    raise ValueError(f"Invalid datetime format: {value}. Expected format: YYYY-MM-DDTHH:MM")
        elif isinstance(value, datetime):
            return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value
        return value
    
    @validator('exam_content', pre=True)
    def validate_exam_content(cls, v):
        if v is None:
            return None
        # Ensure it's serializable JSON
        try:
            json.dumps(v)
            return v
        except (TypeError, ValueError):
            raise ValueError("exam_content must be JSON serializable")
    
    @validator('passing_score', always=True)
    def set_passing_score(cls, v, values):
        if v is None and 'total_points' in values:
            return round(values['total_points'] * 0.75)
        return v
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }   
    
class ExamOut(BaseModel):
    id: int
    title: str
    total_points: int
    instructions: str
    exam_content: Any
    duration: int
    class_id: int
    term_id: int
    is_archive: bool
    passing_score: Optional[int] = None
    shuffle_questions: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    opening_time:datetime
    
    class Config:
        from_attributes = True
        
class AddStudentsToExam(BaseModel):
    exam_id: int
    student_ids: List[int]

# New schemas for update, archive, and restore
class ExamUpdate(BaseModel):
    title: Optional[str] = None
    total_points: Optional[int] = None
    instructions: Optional[str] = None
    exam_content: Optional[Any] = None
    duration: Optional[int] = None
    passing_score: Optional[int] = None
    shuffle_questions: Optional[bool] = None
    is_archive: Optional[bool] = None
    class_material_ids: Optional[List[int]] = None
    closing_time: Optional[datetime] = None

class ArchiveExam(BaseModel):
    is_archive: bool = True

class ExamListResponse(BaseModel):
    exams: List[ExamOut]
    total: int

class SimpleExamResponse(BaseModel):
    """Simplified response for frontend display"""
    id: int
    title: str
    total_points: int
    instructions: str
    duration: int
    passing_score: Optional[int] = None
    shuffle_questions: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        
