from fastapi import FastAPI
from .routers.upload import teacher_router
from .routers import lesson
from .routers import post_test
from .routers import auth
from .routers import logout
from .routers import user
from .routers import subject
from .routers import classes

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
app.include_router(teacher_router)
app.include_router(lesson.router)
app.include_router(post_test.router)
app.include_router(logout.router)

