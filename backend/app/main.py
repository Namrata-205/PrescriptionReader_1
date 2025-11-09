# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from app.routers import auth_router 
# from app.models.user_model import Base 
# from app.services.db_service import engine
# #from app.routers.auth_router import router as auth_router
# from app.prescription_service import process_prescription
# from app.routers import prescription_router
# import os

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Auth routes
# #app.include_router(auth_router, prefix="/api/auth")
# app.include_router(auth_router.router)
# app.include_router(prescription_router.router, prefix="/api") 

# # Create database tables 
# Base.metadata.create_all(bind=engine) 
# #@app.get("/") 
# def read_root(): 
#     return {"message": "Prescription Reader API is running"}

# # Prescription upload route
# @app.post("/api/prescriptions/upload")
# async def upload_prescription(file: UploadFile = File(...)):
#     file_path = f"temp_{file.filename}"
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
#     try:
#         result = process_prescription(file_path)  # call Gemini or OCR
#     finally:
#         os.remove(file_path)
#     return result





# app/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router 
from app.models.user_model import Base 
from app.services.db_service import engine
from app.prescription_service import process_prescription
from app.routers import prescription_router
# --- NEW IMPORTS ---
from app.routers import settings_router # NEW
from app.models import settings_model # IMPORTANT: Need to import models for Base.metadata.create_all to find them
from app.models import medicine_model
# -------------------
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes
app.include_router(auth_router.router)
app.include_router(prescription_router.router, prefix="/api") 
# --- INCLUDE NEW ROUTER ---
app.include_router(settings_router.router, prefix="/api") # NEW
# --------------------------

# Create database tables 
Base.metadata.create_all(bind=engine) 
#@app.get("/") 
def read_root(): 
    return {"message": "Prescription Reader API is running"}

# # Prescription upload route
# @app.post("/api/prescriptions/upload")
# async def upload_prescription(file: UploadFile = File(...)):
#     file_path = f"temp_{file.filename}"
#     with open(file_path, "wb") as f:
#         f.write(await file.read())
#     try:
#         result = process_prescription(file_path)  # call Gemini or OCR
#     finally:
#         os.remove(file_path)
#     return result