# app/schemas/medicine_schema.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Schema for an individual medicine entry (matches OCR output format)
class MedicineSchema(BaseModel):
    medicine_name: str
    dosage: str = ""
    frequency: str = ""
    duration: str = ""
    instructions: str = ""

# Schema for the list of medicines to save (Request body for "Save All" button)
class PrescriptionSaveRequest(BaseModel):
    raw_text: str = ""
    medicines: List[MedicineSchema] = Field(..., description="List of structured medicine data.")

# Schema for displaying a single medicine on MyMedicines page (Response body)
class MedicineDisplay(BaseModel):
    id: int
    medicine_name: str
    dosage: Optional[str] = ""
    frequency: Optional[str] = ""
    duration: Optional[str] = ""
    instructions: Optional[str] = ""
    prescription_date: datetime # Use date from the parent prescription
    
    class Config:
        orm_mode = True
        
# Schema for displaying all prescriptions/medicines (Response body for MyMedicines)
class MedicinesListResponse(BaseModel):
    medicines: List[MedicineDisplay]