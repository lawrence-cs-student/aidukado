

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRES_MINUTES



def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

