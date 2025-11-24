# app/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.auth_schema import UserCreate
from app.models.user_model import User
from app.services.db_service import get_db, engine  # ← ADD engine import
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token
)
# ← ADD THESE IMPORTS
from app.models import medicine_model, settings_model

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # ← ADD THIS: Clear database for new user
    try:
        # Drop and recreate tables (clears all data)
        medicine_model.Medicine.__table__.drop(bind=engine, checkfirst=True)
        settings_model.Settings.__table__.drop(bind=engine, checkfirst=True)
        
        # Recreate empty tables
        medicine_model.Medicine.__table__.create(bind=engine, checkfirst=True)
        settings_model.Settings.__table__.create(bind=engine, checkfirst=True)
        
        #print(f" Database cleared for new user: {user.email}")
    except Exception as e:
        #print(f"⚠️ Error clearing database: {e}")
    # ← END OF ADDITION
    
    # Hash the password
    hashed_pwd = get_password_hash(user.password)
    
    # Create new user
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user_id": new_user.id}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user by email (username field contains email)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
