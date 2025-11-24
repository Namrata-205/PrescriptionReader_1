# app/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.schemas.auth_schema import UserCreate
from app.models.user_model import User
from app.services.db_service import get_db, engine
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token
)
from app.models import medicine_model, settings_model

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # ← FIXED: Delete data rows, not the tables themselves
    try:
        # Delete all rows from tables (keeps table structure)
        db.query(medicine_model.Medicine).delete()
        db.query(settings_model.Settings).delete()
        db.commit()
        
        print(f"✅ Database data cleared for new user: {user.email}")
    except Exception as e:
        db.rollback()
        print(f"⚠️ Error clearing database: {e}")
    
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
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}
