# app/dependencies.py
from fastapi import Depends, HTTPException, status
from typing import Annotated

# : In a real app, this would be replaced by a function 
# that extracts the user ID from the JWT token in the request header.
def get_current_user_id():
    """
    Placeholder dependency to simulate getting the current user's ID.
    Replace with actual JWT/Auth logic (e.g., using jwt.decode)
    """
    # Placeholder: Assuming user 1 is logged in for development
    return 1 # Return dummy ID

# Type alias for use in route parameters
CurrentUser = Annotated[int, Depends(get_current_user_id)]

#------------till sunday aboveeee------------------


#-----------------------------------------------------------------------


#problem arises here

# from fastapi import Depends, HTTPException, status, Header
# from typing import Annotated
# from sqlalchemy.orm import Session 
# # --- NEW CRITICAL IMPORTS ---
# from jose import JWTError, jwt
# from app.services.db_service import get_db
# from app.services.auth_service import SECRET_KEY, ALGORITHM 
# from app.models.user_model import User 
# # ----------------------------

# # Define the exception for unauthenticated users
# oauth2_scheme = HTTPException(
#     status_code=status.HTTP_401_UNAUTHORIZED,
#     detail="Not authenticated",
#     headers={"WWW-Authenticate": "Bearer"},
# )

# def get_current_user_id(
#     db: Session = Depends(get_db),
#     # Retrieve the Authorization header (e.g., "Bearer eyJ...").
#     Authorization: str = Header(..., alias="Authorization") 
# ) -> int:
#     """
#     Dependency to extract the authenticated user's ID from the JWT token.
#     This replaces the placeholder logic that returned '1'.
#     """
#     token_prefix = "Bearer "
#     if not Authorization.startswith(token_prefix):
#         raise oauth2_scheme

#     token = Authorization.replace(token_prefix, "")
    
#     # 1. Decode and Verify Token
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_email: str = payload.get("sub")
#         if user_email is None:
#             raise oauth2_scheme
#     except JWTError:
#         # Token is invalid, expired, or corrupted
#         raise oauth2_scheme
        
#     # 2. Retrieve User ID from DB using the email ('sub') from the JWT
#     user = db.query(User).filter(User.email == user_email).first()
    
#     if user is None:
#         raise oauth2_scheme # User not found
    
#     # Return the actual, authenticated user ID
#     return user.id

# # Type alias for use in route parameters
# CurrentUser = Annotated[int, Depends(get_current_user_id)]




#------------------------------------------------------

# # app/dependencies.py
# from fastapi import Depends, HTTPException, status, Header
# from typing import Annotated
# from sqlalchemy.orm import Session
# # New Imports for JWT and DB access
# from jose import JWTError, jwt
# from app.services.db_service import get_db
# from app.services.auth_service import SECRET_KEY, ALGORITHM # Import constants
# from app.models.user_model import User # Import User model

# # Define the exception for unauthenticated users
# oauth2_scheme = HTTPException(
#     status_code=status.HTTP_401_UNAUTHORIZED,
#     detail="Not authenticated",
#     headers={"WWW-Authenticate": "Bearer"},
# )

# def get_current_user_id(
#     db: Session = Depends(get_db),
#     # Manually retrieve the Authorization header (e.g., "Bearer eyJ...").
#     Authorization: str = Header(..., alias="Authorization") 
# ) -> int:
#     """
#     Dependency to extract the authenticated user's ID from the JWT token.
#     Replaces the placeholder logic.
#     """
#     token_prefix = "Bearer "
#     if not Authorization.startswith(token_prefix):
#         raise oauth2_scheme

#     token = Authorization.replace(token_prefix, "")
    
#     # 2. Decode and Verify Token
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_email: str = payload.get("sub")
#         if user_email is None:
#             raise oauth2_scheme
#     except JWTError:
#         # Token is invalid, expired, or corrupted
#         raise oauth2_scheme
        
#     # 3. Retrieve User ID from DB using the email ('sub') from the JWT
#     user = db.query(User).filter(User.email == user_email).first()
    
#     if user is None:
#         # User in token doesn't exist in DB (shouldn't happen with valid token)
#         raise oauth2_scheme

#     # Return the actual user ID
#     return user.id

# # Type alias for use in route parameters
# CurrentUser = Annotated[int, Depends(get_current_user_id)]