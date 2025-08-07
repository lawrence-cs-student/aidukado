from fastapi import APIRouter, HTTPException, Body
from ..utils.generate_post_test import generate_post_test
from ..models.post_test_model import PostTestRequest

router = APIRouter()

@router.post("/post_test")

async def post_test(data: PostTestRequest):
    print("received lesson: ", data.generatedLesson )
    
    postTest = generate_post_test(data.generatedLesson, data.origFile)

    print(postTest)

    return {"questions" : postTest}