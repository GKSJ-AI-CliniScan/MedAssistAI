
import os
from dotenv import load_dotenv

load_dotenv()

# =====================================
# JWT Configuration
# =====================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "medassist_ai_secret_key_2026"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60