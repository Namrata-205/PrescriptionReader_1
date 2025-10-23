# backend/app/routers/prescription_router.py (Replacing ocr_service.py)
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
from datetime import datetime
from typing import Dict, Any

# NOTE: Adjust these imports based on your actual file locations and names
from app.services.ocr_module import PrescriptionOCR
from app.services.db_service import get_db # Assuming this exists
# Assuming you have a database layer to save the data (similar to db.py)
# You need a function/class to save the prescription, we'll create a placeholder.

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])
ocr = PrescriptionOCR() # Initializes the OCR model
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Placeholder function for saving data to the DB (mimics db.save_prescription)
def save_prescription_data(db: Session, user_id: int, filepath: str, raw_text: str, structured_data: Dict[str, Any]):
    """
    In a real app, this function would use SQLAlchemy to save the data.
    Since we don't have the full DB model, this is a placeholder.
    For now, we'll just return a success ID.
    """
    # Placeholder: Logic to save the data using SQLAlchemy Session (db)
    # The actual implementation depends on your existing models (e.g., 'Prescription' model)
    print(f"Placeholder: Saving prescription for user {user_id} to DB.")
    # You would typically create a new Prescription ORM object, add it, and commit.
    return 1 # Return dummy ID

# IMPORTANT: You need a dependency to get the CURRENT USER ID from the JWT token.
# Since we don't have the full auth setup here, we'll use a dummy dependency for now.
# Replace this with your actual dependency: `get_current_user`
def get_dummy_user_id():
    # Placeholder: In a real app, this extracts the user ID from the JWT payload
    return 1 # Assuming user 1 is logged in

@router.post("/upload")
async def process_prescription_upload(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_dummy_user_id) # Replace with get_current_user
):
    # 1. Save uploaded image
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Ensure filename includes user info to prevent collisions
        filename = f"user_{user_id}_{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Read the file content and write it to disk
        file_content = await file.read()
        with open(filepath, "wb") as f:
            f.write(file_content)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # 2. Process the image using OCR
    raw_text, structured_data = ocr.process_prescription(filepath)
    
    if "Error" in raw_text:
        # OCR processing failed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {raw_text}"
        )
    
    # 3. Save processed data to database
    try:
        prescription_id = save_prescription_data(db, user_id, filepath, raw_text, structured_data)
    except Exception as e:
        # Log the error and raise exception
        print(f"Database save error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save processed data to database"
        )
        
    # 4. Return structured data to frontend
    return {
        "message": "Prescription processed and saved successfully",
        "prescription_id": prescription_id,
        "raw_text": raw_text,
        "structured_data": structured_data # This matches the frontend's expected format
    }