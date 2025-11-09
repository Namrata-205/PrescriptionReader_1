# app/services/auth_service.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "supersecretkey"  # CHANGE THIS IN PRODUCTION!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# app/services/auth_service.py (FIXED)
# app/services/auth_service.py

# ... other imports ...
# app/services/auth_service.py (CLEANED UP)

# ... (pwd_context definition from step 1) ...

def get_password_hash(password):
    # Truncation is no longer necessary with pbkdf2_sha256
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    # Truncation is no longer necessary with pbkdf2_sha256
    return pwd_context.verify(plain_password, hashed_password)

# ... rest of the file ...
# ... rest of the file ...
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
