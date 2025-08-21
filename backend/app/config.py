import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL")

# JWT Auth
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Token Expiry
ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", 30))

# Convert days to minutes for refresh token
REFRESH_TOKEN_EXPIRES_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRES_DAYS", 7))
REFRESH_TOKEN_EXPIRES_MINUTES = REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60
