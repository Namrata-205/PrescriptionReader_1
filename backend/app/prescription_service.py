# backend/app/prescription_service.py
import os
from app.services.ocr_module import PrescriptionOCR

ocr = PrescriptionOCR()

def process_prescription(file_path: str):
    _, structured = ocr.process_prescription(file_path)
    return {"structured_data": structured}
