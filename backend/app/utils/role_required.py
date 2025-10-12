from fastapi import Depends, HTTPException, status
from app.utils.get_current_user import get_current_user



def role_required(allowed_roles: list):
    def wrapper(current_user = Depends(get_current_user)):
        if (current_user['role'] not in allowed_roles):
            raise HTTPException (status_code=status.HTTP_403_FORBIDDEN, detail="You dont have access to this route")
        return current_user
    return wrapper