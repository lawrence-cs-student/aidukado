# app/routers/exam.py
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional
from app.utils.tos import compute_tos
from app.schemas.exam.exam import (
    TOSRequest, CreateExam, ExamOut, ExamUpdate, 
    ArchiveExam, SimpleExamResponse, ExamListResponse, AddStudentsToExam
)
from app.schemas.exam.student_exam_progress import (StudentExamProgressOut, StudentExamWithDetails, 
    CheckAvailabilityRequest, CheckAvailabilityResponse
)
from app.utils.generate_exam import generate_exam_realistic
from datetime import datetime, timezone
from app.models.exam.exams import Exam  
from app.models.exam.student_exam_progress import StudentExamProgress
from app.models.exam.student_exam_reopens import StudentExamReopen
from app.models.class_enrollment import ClassEnrollment
from app.models.class_material import ClassMaterial
from app.models.classes import Classes
from app.models.term import Term
from app.models.users import Users
from sqlalchemy.orm import joinedload
from app.database import SessionLocal
from app.database import get_db
from app.utils.decryption import safe_decrypt_data  # ADD THIS IMPORT

router = APIRouter(prefix="/exam", tags=["exam"])



# For Teachers
@router.get("/getExams/{class_id}", response_model=List[SimpleExamResponse])
async def get_exams_for_class(
    class_id: int,
    term_id: int = Query(..., description="Term ID"),
    is_archive: bool = Query(False, description="Include archived exams"),
    db: Session = Depends(get_db)
):
    """
    Get exams for a specific class and term for frontend display
    Endpoint: GET /exam/getExams/9?term=1
    """
    try:
        # Validate class exists
        class_exists = db.query(Classes).filter(Classes.id == class_id).first()
        if not class_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Class with ID {class_id} not found"
            )
        
        # Validate term exists
        term_exists = db.query(Term).filter(Term.id == term_id).first()
        if not term_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Term with ID {term_id} not found"
            )
        
        # Build query
        query = db.query(Exam).filter(
            Exam.class_id == class_id,
            Exam.term_id == term_id
            
        )
        
        # Filter by archive status if not requesting archived exams
        if not is_archive:
            query = query.filter(Exam.is_archive == False)
        
        # Order by creation date (newest first)
        exams = query.order_by(Exam.created_at.desc()).all()
        
        return exams
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve exams: {str(e)}"
        )

# For Students
@router.get("/student/exams/{class_id}", response_model=List[StudentExamWithDetails])
async def get_student_exams_for_class(
    class_id: int,
    student_id: int = Query(..., description="Student ID"),
    term_id: int = Query(None, description="Term ID (optional)"),
    db: Session = Depends(get_db)
):
    try:
        
        query = db.query(StudentExamProgress).join(
            Exam, StudentExamProgress.exam
        ).filter(
            StudentExamProgress.student_id == student_id,
            Exam.class_id == class_id,
            Exam.is_archive == False,
            Exam.opening_time <= datetime.now(timezone.utc)
        )
        
        if term_id is not None:
            query = query.filter(Exam.term_id == term_id)
        
        
        progress_records = query.order_by(Exam.created_at.desc()).all()
        
        
        exam_list = []
        for progress in progress_records:
            exam = progress.exam  
            exam_list.append({
                "id": progress.id,
                "student_id": progress.student_id,
                "exam_id": progress.exam_id,
                "status": progress.status,
                "score": progress.score,
                "answers": progress.answers,
                "start_time": progress.start_time,
                "created_at": progress.created_at,  
                "updated_at": progress.updated_at,
                "title": exam.title,
                "total_points": exam.total_points,
                "duration": exam.duration,
                "instructions": exam.instructions,
                "passing_score": exam.passing_score,
                "closing_time": exam.closing_time,
                "allow_reopen": exam.allow_reopen
            })
        
        return exam_list
        
    except Exception as e:
        print(f"Error in get_student_exams_for_class: {str(e)}")
        import traceback
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve exam progress for student: {str(e)}"
        )

@router.post("/student/{exam_id}/check-availability", response_model=CheckAvailabilityResponse)
async def check_exam_availability(
    exam_id: int,
    request: CheckAvailabilityRequest,
    db: Session = Depends(get_db)
):
    """
    Check if an exam is available for a specific student.
    """
    try:
        # 1. Check if exam exists
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # 2. Check if student exists
        student = db.query(Users).filter(Users.id == request.studentId).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # 3. Check student's current status in StudentExamProgress
        progress = db.query(StudentExamProgress).filter(
            StudentExamProgress.exam_id == exam_id,
            StudentExamProgress.student_id == request.studentId
        ).first()
        
        if not progress:
            # Student doesn't have this exam assigned
            return CheckAvailabilityResponse(
                isAvailable=False,
                closingTime="",
                reason="Exam not assigned to this student",
                extendedDeadline=False
            )
        
        # 4. Check current status
        current_time = datetime.now(timezone.utc)
        
        # If student already started or submitted, they can always access
        if progress.status in ["in_progress", "submitted"]:
            return CheckAvailabilityResponse(
                isAvailable=True,
                closingTime=exam.closing_time.isoformat() if exam.closing_time else "",
                reason=f"Exam already {progress.status}",
                extendedDeadline=False
            )
        
        # 5. Student is "assigned" - check if exam is still open
        # First check extended deadline in student_exam_reopens
        reopen_record = db.query(StudentExamReopen).filter(
            StudentExamReopen.exam_id == exam_id,
            StudentExamReopen.student_id == request.studentId
        ).first()
        
        if reopen_record:
            # Student has extended deadline
            is_available = current_time <= reopen_record.new_closing_time
            return CheckAvailabilityResponse(
                isAvailable=is_available,
                closingTime=reopen_record.new_closing_time.isoformat(),
                reason="Extended deadline" if is_available else "Extended deadline has passed",
                extendedDeadline=True
            )
        else:
            # No extended deadline, use exam's original closing time
            if not exam.closing_time:
                # No closing time set - always available
                return CheckAvailabilityResponse(
                    isAvailable=True,
                    closingTime="",
                    reason="No closing time set",
                    extendedDeadline=False
                )
            
            is_available = current_time <= exam.closing_time
            return CheckAvailabilityResponse(
                isAvailable=is_available,
                closingTime=exam.closing_time.isoformat(),
                reason="Original deadline" if is_available else "Exam deadline has passed",
                extendedDeadline=False
            )
        
    except Exception as e:
        print(f"Error checking exam availability: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{exam_id}", response_model=ExamOut)
async def get_exam_by_id(
    exam_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific exam
    """
    try:
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        
        if not exam:
            raise HTTPException(
                status_code=404,
                detail=f"Exam with ID {exam_id} not found"
            )
        
        return exam
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve exam: {str(e)}"
        )


@router.put("/{exam_id}", response_model=ExamOut)
async def update_exam(
    exam_id: int,
    exam_update: ExamUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing exam
    """
    try:
        # Find the exam
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        
        if not exam:
            raise HTTPException(
                status_code=404,
                detail=f"Exam with ID {exam_id} not found"
            )
        
        # Update fields
        update_data = exam_update.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if field != "class_material_ids":  # Handle this separately if needed
                setattr(exam, field, value)
        
        # Update timestamp
        exam.updated_at = datetime.now(timezone.utc)
        
        # Commit changes
        db.commit()
        db.refresh(exam)
        
        return exam
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update exam: {str(e)}"
        )


@router.post("/{exam_id}/archive")
async def archive_exam(
    exam_id: int,
    archive_data: ArchiveExam,
    db: Session = Depends(get_db)
):
    """
    Archive or unarchive an exam
    """
    try:
        # Find the exam
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        
        if not exam:
            raise HTTPException(
                status_code=404,
                detail=f"Exam with ID {exam_id} not found"
            )
        
        # Update archive status
        exam.is_archive = archive_data.is_archive
        exam.updated_at = datetime.now(timezone.utc)
        
        # Commit changes
        db.commit()
        db.refresh(exam)
        
        action = "archived" if archive_data.is_archive else "unarchived"
        return {
            "message": f"Exam successfully {action}",
            "exam_id": exam.id,
            "is_archive": exam.is_archive
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to archive exam: {str(e)}"
        )


@router.post("/{exam_id}/restore")
async def restore_exam(
    exam_id: int,
    db: Session = Depends(get_db)
):
    """
    Restore an archived exam (unarchive)
    """
    try:
        # Find the exam
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        
        if not exam:
            raise HTTPException(
                status_code=404,
                detail=f"Exam with ID {exam_id} not found"
            )
        
        # Restore the exam
        exam.is_archive = False
        exam.updated_at = datetime.now(timezone.utc)
        
        # Commit changes
        db.commit()
        db.refresh(exam)
        
        return {
            "message": "Exam successfully restored",
            "exam_id": exam.id,
            "is_archive": exam.is_archive
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to restore exam: {str(e)}"
        )

@router.post("/compute_tos")
async def generate_tos(data: TOSRequest):
    """
    Generate exam from Table of Specifications (async version)
    """
    try:
        lessons_data = [lesson.dict() for lesson in data.lessons]
        result = compute_tos(lessons_data, data.total_items)
        
        exam_questions = await generate_exam_realistic(result, target_total=data.total_items)
        
        print(f"✅ Generated {len(exam_questions)}/{data.total_items} questions")
        
        return {
            "success": True,
            "total_questions": len(exam_questions),
            "requested_items": data.total_items,
            "generated_items": len(exam_questions),
            "tos_distribution": result,
            "questions": exam_questions
        }
        
    except Exception as e:
        print(f"❌ Error in generate_tos endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate exam: {str(e)}"
        )


@router.post("/assignExam")
def assign_exam(exam: CreateExam, db: Session = Depends(get_db)):
    """
    Create and assign an exam to students and link to multiple lessons/materials
    """
    
    # Validate all class materials exist before starting transaction
    if exam.lesson_ids:
        existing_materials = db.query(ClassMaterial.id).filter(
            ClassMaterial.id.in_(exam.lesson_ids),
            ClassMaterial.class_id == exam.class_id
        ).all()
        existing_material_ids = {m.id for m in existing_materials}
        
        missing_materials = set(exam.lesson_ids) - existing_material_ids
        if missing_materials:
            raise HTTPException(
                status_code=404,
                detail=f"Class materials not found or don't belong to class: {missing_materials}"
            )
    
    
    if exam.assigned_students:
        
        active_enrollments = db.query(ClassEnrollment.student_id).filter(
            ClassEnrollment.student_id.in_(exam.assigned_students),
            ClassEnrollment.class_id == exam.class_id,
            ClassEnrollment.is_archive == False,  
            ClassEnrollment.status == "enrolled"    
        ).all()
        
        enrolled_student_ids = {e.student_id for e in active_enrollments}
        
       
        not_enrolled_students = set(exam.assigned_students) - enrolled_student_ids
        
        if not_enrolled_students:
            
            raise HTTPException(
                status_code=400,
                detail=f"Students not enrolled or not active in class: {not_enrolled_students}"
            )
            
            
    
    passing_score = round(exam.total_points * 0.75)
    
    try:
        
        new_exam = Exam(
            title=exam.title,
            total_points=exam.total_points,
            instructions=exam.instructions,
            exam_content=exam.exam_content,  
            duration=exam.duration,
            class_id=exam.class_id,
            is_archive=exam.is_archive,
            passing_score=passing_score,
            term_id=exam.term_id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            closing_time=exam.closing_time,  
            opening_time=exam.opening_time
        )

        db.add(new_exam)
        db.flush()
        
        
        if exam.lesson_ids:
            materials = db.query(ClassMaterial).filter(
                ClassMaterial.id.in_(exam.lesson_ids)
            ).all()
            new_exam.class_materials.extend(materials)  
        
        
        student_progress_entries = []
        for student_id in exam.assigned_students:
            student_progress = StudentExamProgress(
                student_id=student_id,
                exam_id=new_exam.id,
                status="assigned",
                score=None,
                start_time=None,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            student_progress_entries.append(student_progress)
        
        db.add_all(student_progress_entries)
        db.commit()
        db.refresh(new_exam)

        return {
            "message": "Exam created and assigned successfully",
            "exam_id": new_exam.id,
            "assigned_students_count": len(exam.assigned_students),
            "linked_lessons_count": len(exam.lesson_ids) if exam.lesson_ids else 0,
            "linked_lesson_ids": exam.lesson_ids if exam.lesson_ids else []
        }

    except Exception as e:
        db.rollback()
        
        raise HTTPException(
            status_code=500,
            detail=f"Database error while creating exam: {str(e)}"
        )
        
# ALL ENDPOINT FOR EXAM MONITORING

@router.get("/{exam_id}/assigned-students")
def get_assigned_students(exam_id: int, db: Session = Depends(get_db)):
    """
    Get list of student IDs already assigned to an exam
    """
    assigned = db.query(StudentExamProgress.student_id).filter(
        StudentExamProgress.exam_id == exam_id
    ).all()
    
    return [s.student_id for s in assigned]

# Get exam monitoring data
@router.get('/monitoring/{exam_id}')
def exam_monitoring(exam_id: int, db: Session = Depends(get_db)):
    """
    Get comprehensive exam monitoring data for teachers
    """
    # Get exam header info
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Get linked materials
    linked_materials = [material.title for material in exam.class_materials]
    
    # Get student progress data
    results = (
        db.query(
            Users.first_name, 
            Users.last_name, 
            StudentExamProgress.status,
            StudentExamProgress.score,
        )
        .join(StudentExamProgress, StudentExamProgress.student_id == Users.id)
        .filter(StudentExamProgress.exam_id == exam_id)
        .order_by(Users.last_name, Users.first_name)
        .all()
    )
    
    # Decrypt student names
    scores = []
    for r in results:
        decrypted_first = safe_decrypt_data(r.first_name) if r.first_name else ""
        decrypted_last = safe_decrypt_data(r.last_name) if r.last_name else ""
        
        scores.append({
            "studentName": f"{decrypted_first} {decrypted_last}".strip(),
            "status": r.status,
            "score": r.score,
        })
    
    return {
        "examTitle": exam.title,
        "totalPoints": exam.total_points,
        "duration": exam.duration,
        "passingScore": exam.passing_score,
        "instructions": exam.instructions,
        "opening_time": exam.opening_time,  
        "closing_time": exam.closing_time,  
        "allow_reopen": exam.allow_reopen,  
        "linkedMaterials": linked_materials,
        "scores": scores  # Now with decrypted names
    }


@router.post("/assign-students")
def assign_exam_students(
    request: AddStudentsToExam,
    db: Session = Depends(get_db)
):
    """
    Assign additional students to an existing exam
    """
    try:
        # Check if exam exists
        exam = db.query(Exam).filter(Exam.id == request.exam_id).first()
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Check which students are already assigned
        already_assigned = db.query(StudentExamProgress.student_id).filter(
            StudentExamProgress.exam_id == request.exam_id,
            StudentExamProgress.student_id.in_(request.student_ids)
        ).all()
        already_assigned_ids = {assigned[0] for assigned in already_assigned}
        
        assigned_count = 0
        skipped_count = 0
        for student_id in request.student_ids:
            if student_id in already_assigned_ids:
                skipped_count += 1
                continue
                
            # Create new progress record
            progress = StudentExamProgress(
                student_id=student_id,
                exam_id=request.exam_id,
                status="assigned",
                score=None,
                answers=None,
                start_time=None
            )
            db.add(progress)
            assigned_count += 1
        
        db.commit()
        
        return {
            "message": f"Assigned {assigned_count} new students, {skipped_count} were already assigned",
            "assigned_count": assigned_count,
            "skipped_count": skipped_count
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to assign students: {str(e)}"
        )
        
@router.post("/compute_tos")
async def generate_tos(data: TOSRequest):
    """
    Generate exam from Table of Specifications (async version)
    """
    try:
        lessons_data = [lesson.dict() for lesson in data.lessons]
        result = compute_tos(lessons_data, data.total_items)

        exam_questions = await generate_exam_realistic(result, target_total=data.total_items)

        print(f"✅ Generated {len(exam_questions)}/{data.total_items} questions")

        return {
            "success": True,
            "total_questions": len(exam_questions),
            "requested_items": data.total_items,
            "generated_items": len(exam_questions),
            "tos_distribution": result,
            "questions": exam_questions
        }

    except Exception as e:
        print(f"❌ Error in generate_tos endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate exam: {str(e)}"
        )