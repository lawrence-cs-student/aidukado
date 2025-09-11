
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.subject import SubjectCreate, SubjectOut, SubjectUpdate
from app.models.subjects import Subject


router = APIRouter(prefix="/subject", tags=["subject"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.get("/get", response_model=list[SubjectOut])
def get_subjects(query: str | None = None, db: Session = Depends(get_db)):
    
    subjects = db.query(Subject)
    
    if query:
        subjects = subjects.filter(
        Subject.name.ilike(f"%{query}%")
    )
        
    subjects = subjects.order_by(Subject.id.asc()).all()
    
    return subjects
    
@router.get("/getById/{subject_id}", response_model=SubjectOut)
def get_subject_by_id(subject_id : int, db: Session = Depends(get_db)):
    
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="subject not found")
    
    return subject

@router.post("/create")
def create_subject(subject : SubjectCreate, db: Session = Depends(get_db)):
    
    new_subject = Subject(
        name = subject.name,
        description = subject.description
    )
    
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    
    return {"message" : "Subject Created Successfully"}

@router.patch("/update/{subject_id}")
def patch_subject(subject_id: int, subject_update: SubjectUpdate, db: Session = Depends(get_db)):
    
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found.")
    
    for key, value in subject_update.dict(exclude_unset=True).items():
        setattr(subject, key, value)
        
    db.commit()
    db.refresh(subject)
    
    return {"message" : f"Subject with {subject_id} has been updated."}
        
    
@router.delete("/delete/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()
    
    return {"message" : f"subject with {subject_id} has been updated"}