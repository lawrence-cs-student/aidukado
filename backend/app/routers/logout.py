from fastapi import Response, APIRouter

router = APIRouter()

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    
    return {"message" : "logged out successfully"}