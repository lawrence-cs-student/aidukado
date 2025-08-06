from fastapi import FastAPI
from .routers import upload
from .routers import lesson
from .routers import post_test
from .routers import user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(upload.router)
app.include_router(lesson.router)
app.include_router(post_test.router)

