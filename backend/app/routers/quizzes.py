from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.quizzes import Quizzes
from app.schemas.quizzes import CreateQuiz, QuizOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f"Database error: {e}")
        raise   # 👈 re-raise so FastAPI sees the error
    finally:
        db.close()

@router.post('/assignQuiz')
def assign_quiz(quiz: CreateQuiz, db: Session = Depends(get_db)):

    new_quiz = Quizzes(
        lesson_id = quiz.lesson_id,
        title = quiz.title,
        description = quiz.description,
        total_points = quiz.total_points,
        instruction = quiz.instruction,
        quiz_content = quiz.quiz_content 
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return {"message": "Quiz saved successfully"}

@router.get('/getQuiz/{lessonId}', response_model = QuizOut)
def get_quiz(lessonId: int, db:Session = Depends(get_db)):
    quiz = db.query(Quizzes).filter(Quizzes.lesson_id == lessonId).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return quiz

