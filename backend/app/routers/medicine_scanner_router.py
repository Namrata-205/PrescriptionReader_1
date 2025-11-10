# backend/app/routers/medicine_scanner_router.py
from fastapi import APIRouter, UploadFile, File, HTTPException, status
import os
from datetime import datetime
from typing import Dict, Any

from app.services.medicine_scanner import MedicineScanner  # Your existing scanner class

router = APIRouter(prefix="/scan", tags=["scan"])

# Initialize the OCR / Gemini scanner

scanner = MedicineScanner(api_key=os.getenv("GEMINI_API_KEY"))

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_prescription(file: UploadFile = File(...)):
    """
    Receives a prescription image, processes it with MedicineScanner,
    and returns the extracted medicines and expiry dates.
    No database storage is performed.
    """
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Save file temporarily
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save uploaded file: {str(e)}"
        )

    try:
        # Process the file using the scanner
        raw_text, structured_data = scanner.process_label(filepath)

        # Print the results (for debugging / logging)
        print("OCR Raw Text:\n", raw_text)
        print("Structured Data:\n", structured_data)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {str(e)}"
        )
    finally:
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)

    # Return the result to frontend
    return {
        "message": "Prescription processed successfully",
        "raw_text": raw_text,
        "structured_data": structured_data
    }