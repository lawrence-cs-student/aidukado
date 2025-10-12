from fastapi import APIRouter, Depends, HTTPException
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.score import Score
from app.schemas.score import CreateScore

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
    new_score = Score(
        student_id = score.student_id,
        test_type = score.test_type,
        test_id = score.test_id,
        score = score.score
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)
