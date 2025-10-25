from fastapi import APIRouter, HTTPException, Depends, File, Form, UploadFile
from typing import List
from sqlalchemy.orm import Session, load_only
from app.database import SessionLocal
from app.schemas.student_submission import SubmissionCreate
from app.models import StudentSubmission
import json
from app.utils.r2_helper import upload_file, generate_presigned_url


router = APIRouter(prefix="/student_submission", tags=["student_submission"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/upload")
async def submit_file(metadata: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    try:
        metadata_dict = json.loads(metadata)

        submission_data = SubmissionCreate(
            material_id=metadata_dict["materialId"],
            student_id=metadata_dict["studentId"],
            type=metadata_dict["type"],
        ) 
        
        file_bytes = await file.read()

        folder = f"submission/{submission_data.type}"
        file_key = upload_file(file_bytes, file.filename, folder)

        submission = StudentSubmission(
            material_id = submission_data.material_id,
            student_id = submission_data.student_id,
            file_path = file_key,
            status = "submitted"
        )

        db.add(submission)
        db.commit()  
        db.refresh(submission)
        
        return {"message": "File submitted successfully", "submission_id": submission.id}
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid metadata JSON format.")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field in metadata: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))