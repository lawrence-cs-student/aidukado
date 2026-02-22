from fastapi import APIRouter, Depends, HTTPException, Form, Query
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.models.quiz import Quiz
from app.schemas.quiz import CreateQuiz, QuizOut, AddStudentsRequest, QuizOutSimple, QuizMonitoringResponse, QuizMonitoringStudent
from ..utils.generate_quiz import generate_quiz
from app.models.lesson_content import LessonContent
from app.models.class_material import ClassMaterial
from app.models.student_quiz_progress import StudentQuizProgress
from app.models.users import Users
from app.models.class_enrollment import ClassEnrollment
from app.models.quiz_attempts import StartTime
from app.schemas.quiz_attempts import CreateStartTime
from datetime import datetime
from sqlalchemy import desc
from app.database import get_db
from app.utils.decryption import safe_decrypt_data  # ADD THIS IMPORT

router = APIRouter()



#get generated quiz
@router.post("/generateQuiz")
async def gen_quiz(lesson: str = Form(...), items: int = Form(...), question_type: str = Form(...)):
    questions = await generate_quiz(lesson, items, question_type)    
    return {"quiz": questions}


# For assigning upon quiz creation
from datetime import datetime, timezone, timedelta

@router.post("/assignQuiz")
def assign_quiz(quiz: CreateQuiz, db: Session = Depends(get_db)):
    # If opening_time is None from frontend, set it to current time
    if quiz.opening_time is None:
        opening_time = datetime.now(timezone.utc)
    else:
        opening_time = quiz.opening_time
    
    # If closing_time is None from frontend, set it to 7 days from opening_time
    if quiz.closing_time is None:
        closing_time = opening_time + timedelta(days=7)
    else:
        closing_time = quiz.closing_time
    
    new_quiz = Quiz(
        lesson_id=quiz.lesson_id,
        title=quiz.title,
        total_points=quiz.total_points,
        instructions=quiz.instructions,
        quiz_content=quiz.quiz_content,
        duration=quiz.duration,
        class_id=quiz.class_id,
        is_archive=quiz.is_archive,
        assessment_type=quiz.assessment_type,
        term_id=quiz.term_id,
        opening_time=opening_time,  # Will never be None
        closing_time=closing_time   # Will never be None
    )

    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    for student_id in quiz.assigned_students:
        db.add(
            StudentQuizProgress(
                quiz_id=new_quiz.id,
                student_id=student_id,
                status="assigned"
            )
        )

    db.commit()

    return {"message": "Quiz created and assigned successfully"}

# For late assigning
@router.post("/assignQuizStudents")
def assign_students_to_quiz(
    payload: AddStudentsRequest,
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == payload.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    existing_students = {
        row.student_id
        for row in db.query(StudentQuizProgress)
        .filter(StudentQuizProgress.quiz_id == payload.quiz_id)
        .all()
    }

    for student_id in payload.student_ids:
        if student_id not in existing_students:
            db.add(
                StudentQuizProgress(
                    quiz_id=payload.quiz_id,
                    student_id=student_id,
                    status="assigned"
                )
            )

    db.commit()
    return {"message": "Students assigned successfully"}

# Getting all assigned students
@router.get("/quiz/{quiz_id}/assigned-students")
def get_assigned_students(quiz_id: int, db: Session = Depends(get_db)):
    assigned = db.query(StudentQuizProgress.student_id).filter(
        StudentQuizProgress.quiz_id == quiz_id
    ).all()

    return [s.student_id for s in assigned]


#get quiz from database
@router.get('/getQuiz/{quizId}', response_model = QuizOut)
def get_quiz(quizId: int, db:Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quizId).first()

    if not quiz:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return quiz

# For Teachers
@router.get('/getQuizzes/{classId}', response_model=list[QuizOut])
def get_quizzes(classId: int, term: int = Query(...), db: Session = Depends(get_db)):
    try:
        quizzes = db.query(Quiz).filter(
            Quiz.class_id == classId, 
            Quiz.term_id == term, 
            Quiz.is_archive == False
        ).order_by(desc(Quiz.created_at)).all()

        if not quizzes:
            raise HTTPException(status_code=404, detail="No quizzes found")

        return quizzes

    except Exception as e:
        
        print(f"Error occurred: {e}")  
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    
# For Students
@router.get("/student/quizzes/{classId}", response_model=list[QuizOutSimple])
def get_student_quizzes(
    classId: int,
    term: int = Query(...),
    student_id: int = Query(...),
    db: Session = Depends(get_db)
):
    
    results = (
        db.query(Quiz, StudentQuizProgress)
        .join(StudentQuizProgress, StudentQuizProgress.quiz_id == Quiz.id)
        .filter(
            Quiz.class_id == classId,
            Quiz.term_id == term,
            Quiz.is_archive == False,
            StudentQuizProgress.student_id == student_id,
            Quiz.opening_time <= datetime.now(timezone.utc)
        )
        .order_by(desc(Quiz.created_at))
        .all()
    )
    
    if not results:
        return []
    
    quizzes_out = []
    for quiz, progress in results:
        quiz_out = QuizOutSimple(
            id=quiz.id,
            title=quiz.title,
            duration=quiz.duration,
            total_points=quiz.total_points,
            assessment_type=quiz.assessment_type,
            created_at=quiz.created_at,
            score=progress.score,
            status=progress.status,
            closing_time=quiz.closing_time,  
            opening_time=quiz.opening_time   
        )
        quizzes_out.append(quiz_out)
    
    return quizzes_out

@router.patch('/archiveQuiz/{quiz_id}')
def archive_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz.is_archive = True  
    db.commit()
    db.refresh(Quiz)             
    return {"message": "Archived successfully"}


@router.get('/quizMonitoring/{quizId}')
def quiz_monitoring(quizId: int, db: Session = Depends(get_db)):
    # Get quiz details including class_id
    quiz = db.query(Quiz).filter(Quiz.id == quizId).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Get class material title
    material = db.query(ClassMaterial).filter(ClassMaterial.id == quiz.lesson_id).first()
    
    # Get all students enrolled in the class
    enrolled_students = (
        db.query(Users.id, Users.first_name, Users.last_name)
        .join(ClassEnrollment, ClassEnrollment.student_id == Users.id)
        .filter(ClassEnrollment.class_id == quiz.class_id)
        .all()
    )
    
    # Get all quiz progress records for this quiz
    progress_records = (
        db.query(
            StudentQuizProgress.student_id,
            StudentQuizProgress.score,
            StudentQuizProgress.status,
            StudentQuizProgress.start_time,
            StudentQuizProgress.answers  # Check answers to see if submitted
        )
        .filter(StudentQuizProgress.quiz_id == quizId)
        .all()
    )
    
    # Convert to dict for easy lookup
    progress_dict = {record.student_id: record for record in progress_records}
    
    # Build response with decrypted names
    scores = []
    for student in enrolled_students:
        # Decrypt student names
        decrypted_first = safe_decrypt_data(student.first_name) if student.first_name else ""
        decrypted_last = safe_decrypt_data(student.last_name) if student.last_name else ""
        full_name = f"{decrypted_first} {decrypted_last}".strip()
        
        progress = progress_dict.get(student.id)
        
        if progress:
            # Determine status based on score and answers
            if progress.score is not None:
                status = "completed"
                submission_status = "Submitted"
            elif progress.answers is not None:
                # Has answers but no score yet (maybe being graded)
                status = "submitted"
                submission_status = "Submitted (Ungraded)"
            elif progress.start_time is not None:
                status = "started"
                submission_status = "In Progress"
            else:
                status = progress.status if progress.status else "assigned"
                submission_status = "Assigned"
        else:
            status = "not_assigned"
            submission_status = "Not Assigned"
        
        scores.append({
            "studentId": student.id,
            "studentName": full_name,  # Now with decrypted names
            "score": progress.score if progress else None,
            "status": status,
            "submissionStatus": submission_status,
            "startTime": progress.start_time if progress else None,
            "hasAnswers": progress.answers is not None if progress else False
        })
    
    return {
        "quizTitle": quiz.title,
        "lessonTitle": material.title if material else "No material",
        "totalPoints": quiz.total_points,
        "closingTime": quiz.closing_time,
        "openingTime": quiz.opening_time,
        "scores": scores  # Now with decrypted names
    }

@router.get('/getStudentsByClass/{class_id}')
def getStudents(class_id: int, db: Session = Depends(get_db)):
    getStudents = (
     db.query(Users.id, Users.first_name, Users.last_name)
    .join(ClassEnrollment, ClassEnrollment.student_id == Users.id)
    .filter(ClassEnrollment.class_id == class_id).all()
    )

    # Decrypt names before returning
    result = []
    for student in getStudents:
        decrypted_first = safe_decrypt_data(student.first_name) if student.first_name else ""
        decrypted_last = safe_decrypt_data(student.last_name) if student.last_name else ""
        
        result.append({
            'id': student.id,
            'first_name': decrypted_first,
            'last_name': decrypted_last
        })
    
    return result