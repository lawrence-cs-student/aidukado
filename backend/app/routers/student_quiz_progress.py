from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.student_quiz_progress import StudentQuizProgress
from app.schemas.student_quiz_progress import CreateScore, ScoreOut

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

@router.post('/saveScore')
def save_score(score: CreateScore, db: Session = Depends(get_db)):
    new_score = StudentQuizProgress(
        student_id = score.student_id,
        quiz_id = score.quiz_id,
        status = score.status,
        score = score.score,
        answers = score.answers
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)

@router.get("/getUserAnswers/{quizId}/{studentId}")
def get_quiz_with_answers(quizId: int, studentId: int, db: Session = Depends(get_db)):
    
    # Fetch student's previous answers
    progress = db.query(StudentQuizProgress).filter(
        StudentQuizProgress.student_id == studentId,
        StudentQuizProgress.quiz_id == quizId
    ).first()

    if not progress:
        return {
            "answers": {},
            "score": None,
            "taken": False
        }

    return {
        "answers": progress.answers,
        "score": progress.score,
        "taken": True
    }