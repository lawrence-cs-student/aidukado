from fastapi import APIRouter, HTTPException, Body
from ..utils.generate_pretest import generate_pretest

router = APIRouter()

@router.post("/post_test")

async def post_test(lesson: str = Body(..., media_type="text/plain")):
    print("received lesson: ", lesson )
    
    postTest = generate_pretest(lesson)

    return {"questions" : postTest}