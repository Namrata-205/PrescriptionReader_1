# from fastapi import APIRouter, UploadFile, File
# import os
# from datetime import datetime
# from app.services.ocr_module import PrescriptionOCR

# router = APIRouter()
# ocr = PrescriptionOCR()
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# @router.post("/process_prescription")
# async def process_prescription(file: UploadFile = File(...)):
#     # Save uploaded image
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     filename = f"{timestamp}_{file.filename}"
#     filepath = os.path.join(UPLOAD_DIR, filename)
#     with open(filepath, "wb") as f:
#         f.write(await file.read())

#     raw_text, structured_data = ocr.process_prescription(filepath)
#     return {"raw_text": raw_text, "structured_data": structured_data}
