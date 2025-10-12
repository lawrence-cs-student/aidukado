from fastapi import FastAPI
#from .routers.upload import teacher_router
from .routers.upload import router
import app.models  
from .routers import (
    post_test,
    auth,
    logout,
    quizzes,
    user,
    subject,
    classes,
    class_enrollment,
    getLesson,
    score
    # lesson
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(subject.router)
app.include_router(classes.router)
app.include_router(class_enrollment.router)
app.include_router(router)
#app.include_router(teacher_router)
# app.include_router(lesson.router)
app.include_router(post_test.router)
app.include_router(logout.router)
app.include_router(getLesson.router)
app.include_router(quizzes.router)
app.include_router(score.router)

