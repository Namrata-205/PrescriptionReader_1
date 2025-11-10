# app/medicine_service.py

from app.services.ocr_module import MedicineLabelOCR # Or reuse if generic

def process_label(file_path: str):
    """
    Processes a medicine image to extract the drug label name and expiry date.
    """
    # Initialize your OCR/AI service tailored for label reading
    label_ocr = MedicineLabelOCR() 
    
    # This method performs the OCR and structuring
    name, expiry = label_ocr.extract_label_details(file_path)
    
    return {
        "drug_label_name": name,
        "expiry_date": expiry
    }