# # backend/app/routers/prescription_router.py (Replacing ocr_service.py)
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# import os
# from datetime import datetime
# from typing import Dict, Any

# # NOTE: Adjust these imports based on your actual file locations and names
# from app.services.ocr_module import PrescriptionOCR
# from app.services.db_service import get_db # Assuming this exists
# # Assuming you have a database layer to save the data (similar to db.py)
# # You need a function/class to save the prescription, we'll create a placeholder.

# router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])
# ocr = PrescriptionOCR() # Initializes the OCR model
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # Placeholder function for saving data to the DB (mimics db.save_prescription)
# def save_prescription_data(db: Session, user_id: int, filepath: str, raw_text: str, structured_data: Dict[str, Any]):
#     """
#     In a real app, this function would use SQLAlchemy to save the data.
#     Since we don't have the full DB model, this is a placeholder.
#     For now, we'll just return a success ID.
#     """
#     # Placeholder: Logic to save the data using SQLAlchemy Session (db)
#     # The actual implementation depends on your existing models (e.g., 'Prescription' model)
#     print(f"Placeholder: Saving prescription for user {user_id} to DB.")
#     # You would typically create a new Prescription ORM object, add it, and commit.
#     return 1 # Return dummy ID

# # IMPORTANT: You need a dependency to get the CURRENT USER ID from the JWT token.
# # Since we don't have the full auth setup here, we'll use a dummy dependency for now.
# # Replace this with your actual dependency: `get_current_user`
# def get_dummy_user_id():
#     # Placeholder: In a real app, this extracts the user ID from the JWT payload
#     return 1 # Assuming user 1 is logged in

# @router.post("/upload")
# async def process_prescription_upload(
#     file: UploadFile = File(...), 
#     db: Session = Depends(get_db), 
#     user_id: int = Depends(get_dummy_user_id) # Replace with get_current_user
# ):
#     # 1. Save uploaded image
#     try:
#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#         # Ensure filename includes user info to prevent collisions
#         filename = f"user_{user_id}_{timestamp}_{file.filename}"
#         filepath = os.path.join(UPLOAD_DIR, filename)
        
#         # Read the file content and write it to disk
#         file_content = await file.read()
#         with open(filepath, "wb") as f:
#             f.write(file_content)

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to save file: {str(e)}"
#         )

#     # 2. Process the image using OCR
#     raw_text, structured_data = ocr.process_prescription(filepath)
    
#     if "Error" in raw_text:
#         # OCR processing failed
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"OCR processing failed: {raw_text}"
#         )
    
#     # 3. Save processed data to database
#     try:
#         prescription_id = save_prescription_data(db, user_id, filepath, raw_text, structured_data)
#     except Exception as e:
#         # Log the error and raise exception
#         print(f"Database save error: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to save processed data to database"
#         )
        
#     # 4. Return structured data to frontend
#     return {
#         "message": "Prescription processed and saved successfully",
#         "prescription_id": prescription_id,
#         "raw_text": raw_text,
#         "structured_data": structured_data # This matches the frontend's expected format
#     }
#----------------------------------------------------------------------------------------------









# app/routers/prescription_router.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
from datetime import datetime
from typing import Dict, Any, List

# NOTE: Adjust these imports based on your actual file locations and names
from app.services.ocr_module import PrescriptionOCR
from app.services.db_service import get_db 
# Import the dependency alias and new models/schemas
from app.dependencies import get_current_user_id as CurrentUser 
from app.models.medicine_model import Prescription, Medicine
from app.schemas.medicine_schema import PrescriptionSaveRequest, MedicineDisplay, MedicinesListResponse, MedicineSchema


router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])
ocr = PrescriptionOCR() # Initializes the OCR model
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Using the imported CurrentUser alias from dependencies.py
get_dummy_user_id = CurrentUser

@router.post("/upload")
async def process_prescription_upload(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    user_id: int = Depends(CurrentUser)
):
    # 1. Save uploaded image (temporary for OCR processing)
    filepath = None
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Ensure filename includes user info to prevent collisions
        filename = f"user_{user_id}_{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
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
    
    # 3. Clean up the uploaded file immediately after processing
    if filepath and os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            print(f"Cleanup failed for {filepath}: {str(e)}")
        
    if "Error" in raw_text:
        # OCR processing failed
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {raw_text}"
        )
        
    # 4. Return structured data and raw text to frontend for user review/editing
    return {
        "message": "Prescription processed for review",
        "raw_text": raw_text,
        "structured_data": structured_data
    }


# NEW ENDPOINT: To save the final, user-reviewed/edited prescription data
@router.post("/save", status_code=status.HTTP_201_CREATED)
def save_prescription(
    save_request: PrescriptionSaveRequest,
    user_id: int = Depends(CurrentUser),
    db: Session = Depends(get_db)
):
    # 1. Create the parent Prescription record
    new_prescription = Prescription(
        user_id=user_id,
        raw_text=save_request.raw_text,
        upload_date=datetime.utcnow()
    )
    db.add(new_prescription)
    db.flush() # Flush to get the new_prescription.id

    # 2. Create the child Medicine records
    for med_data in save_request.medicines:
        new_medicine = Medicine(
            prescription_id=new_prescription.id,
            medicine_name=med_data.medicine_name,
            dosage=med_data.dosage,
            frequency=med_data.frequency,
            duration=med_data.duration,
            instructions=med_data.instructions
        )
        db.add(new_medicine)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Database save error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save prescription data to database"
        )
        
    return {"message": "Prescription and medicines saved successfully", "prescription_id": new_prescription.id}


# NEW ENDPOINT: To fetch all saved medicines for MyMedicines page
@router.get("/", response_model=MedicinesListResponse)
def get_all_medicines(
    user_id: int = Depends(CurrentUser),
    db: Session = Depends(get_db)
):
    # Join Medicines with Prescriptions to filter by user_id and get upload_date
    results = (
        db.query(Medicine, Prescription)
        .join(Prescription)
        .filter(Prescription.user_id == user_id)
        .order_by(Prescription.upload_date.desc())
        .all()
    )
    
    medicines_list = []
    for medicine, prescription in results:
        medicines_list.append(MedicineDisplay(
            id=medicine.id,
            medicine_name=medicine.medicine_name,
            dosage=medicine.dosage,
            frequency=medicine.frequency,
            duration=medicine.duration,
            instructions=medicine.instructions,
            prescription_date=prescription.upload_date
        ))
        
    return {"medicines": medicines_list}




















#----------------------------------------------------------------------------------------------

# # app/routers/prescription_router.py
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# import os
# from datetime import datetime
# from typing import Dict, Any, List

# # NOTE: Adjust these imports based on your actual file locations and names
# from app.services.ocr_module import PrescriptionOCR
# from app.services.db_service import get_db 
# # Import the dependency alias and new models/schemas
# from app.dependencies import get_current_user_id as CurrentUser 
# from app.models.medicine_model import Prescription, Medicine
# from app.schemas.medicine_schema import PrescriptionSaveRequest, MedicineDisplay, MedicinesListResponse, MedicineSchema


# router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])
# ocr = PrescriptionOCR() # Initializes the OCR model
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # Using the imported CurrentUser alias from dependencies.py
# get_dummy_user_id = CurrentUser

# @router.post("/upload")
# async def process_prescription_upload(
#     file: UploadFile = File(...), 
#     db: Session = Depends(get_db), 
#     user_id: int = Depends(CurrentUser)
# ):
#     # 1. Save uploaded image (temporary for OCR processing)
#     filepath = None
#     try:
#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#         # Ensure filename includes user info to prevent collisions
#         filename = f"user_{user_id}_{timestamp}_{file.filename}"
#         filepath = os.path.join(UPLOAD_DIR, filename)
        
#         file_content = await file.read()
#         with open(filepath, "wb") as f:
#             f.write(file_content)

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to save file: {str(e)}"
#         )

#     # 2. Process the image using OCR
#     raw_text, structured_data = ocr.process_prescription(filepath)
    
#     # 3. Clean up the uploaded file immediately after processing
#     if filepath and os.path.exists(filepath):
#         try:
#             os.remove(filepath)
#         except Exception as e:
#             print(f"Cleanup failed for {filepath}: {str(e)}")
        
#     if "Error" in raw_text:
#         # OCR processing failed
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"OCR processing failed: {raw_text}"
#         )
        
#     # 4. Return structured data and raw text to frontend for user review/editing
#     return {
#         "message": "Prescription processed for review",
#         "raw_text": raw_text,
#         "structured_data": structured_data
#     }

# # NEW ENDPOINT: To save the final, user-reviewed/edited prescription data
# @router.post("/save", status_code=status.HTTP_201_CREATED)
# def save_prescription(
#     save_request: PrescriptionSaveRequest,
#     user_id: int = Depends(CurrentUser),
#     db: Session = Depends(get_db)
# ):
#     # 1. Create the parent Prescription record
#     new_prescription = Prescription(
#         user_id=user_id,
#         raw_text=save_request.raw_text,
#         upload_date=datetime.utcnow()
#     )
#     db.add(new_prescription)
#     db.flush() # Flush to get the new_prescription.id

#     # 2. Create the child Medicine records
#     for med_data in save_request.medicines:
#         new_medicine = Medicine(
#             prescription_id=new_prescription.id,
#             medicine_name=med_data.medicine_name,
#             dosage=med_data.dosage,
#             frequency=med_data.frequency,
#             duration=med_data.duration,
#             instructions=med_data.instructions
#         )
#         db.add(new_medicine)

#     try:
#         db.commit()
#     except Exception as e:
#         db.rollback()
#         print(f"Database save error: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to save prescription data to database"
#         )
        
#     return {"message": "Prescription and medicines saved successfully", "prescription_id": new_prescription.id}


# # NEW ENDPOINT: To fetch all saved medicines for MyMedicines page
# @router.get("/", response_model=MedicinesListResponse)
# def get_all_medicines(
#     user_id: int = Depends(CurrentUser),
#     db: Session = Depends(get_db)
# ):
#     # Join Medicines with Prescriptions to filter by user_id and get upload_date
#     results = (
#         db.query(Medicine, Prescription)
#         .join(Prescription)
#         .filter(Prescription.user_id == user_id)
#         .order_by(Prescription.upload_date.desc())
#         .all()
#     )
    
#     medicines_list = []
#     for medicine, prescription in results:
#         medicines_list.append(MedicineDisplay(
#             id=medicine.id,
#             medicine_name=medicine.medicine_name,
#             dosage=medicine.dosage,
#             frequency=medicine.frequency,
#             duration=medicine.duration,
#             instructions=medicine.instructions,
#             prescription_date=prescription.upload_date
#         ))
        
#     return {"medicines": medicines_list}

