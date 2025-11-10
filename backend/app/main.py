from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router 
from app.models.user_model import Base 
from app.services.db_service import engine
from app.prescription_service import process_prescription
from app.routers import prescription_router
from app.routers import medicine_scanner_router
from app.routers import settings_router
from app.models import settings_model
from app.models import medicine_model
import os

# ===== CHATBOT IMPORTS =====
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional
# ===== END CHATBOT IMPORTS =====

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(prescription_router.router, prefix="/api") 
app.include_router(medicine_scanner_router.router, prefix="/api")
app.include_router(settings_router.router, prefix="/api")

# Create database tables 
Base.metadata.create_all(bind=engine) 

# ===== CHATBOT SETUP =====
# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Models
class ChatRequest(BaseModel):
    message: str
    medicines: List[dict]
    conversationHistory: List[dict] = []

class ChatResponse(BaseModel):
    success: bool
    response: str
    error: Optional[str] = None
# ===== END CHATBOT SETUP =====

def read_root(): 
    return {"message": "Prescription Reader API is running"}

# Prescription upload route
@app.post("/api/prescriptions/upload")
async def upload_prescription(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    try:
        result = process_prescription(file_path)
    finally:
        os.remove(file_path)
    return result

@app.post("/api/medicine/upload")
async def upload_medicine(file: UploadFile = File(...)):
    """
    Legacy endpoint - consider using /api/scan/upload instead
    """
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    try:
        result = process_prescription(file_path)
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
    return result

# ===== CHATBOT ENDPOINT =====
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """Answer questions about medicines from prescription only"""
    try:
        # 1️⃣ Prepare medicines context
        if not request.medicines:
            return ChatResponse(
                success=True,
                response="No medicines were uploaded from your prescription. Please upload a prescription first.",
                error=None
            )

        medicines_text = "USER'S PRESCRIPTION MEDICINES:\n"
        for med in request.medicines:
            medicines_text += f"- {med.get('medicine_name', 'Unknown')}\n"
            medicines_text += f"  Dosage: {med.get('dosage', 'Not specified')}\n"
            medicines_text += f"  Frequency: {med.get('frequency', 'Not specified')}\n"
            if med.get("instructions"):
                medicines_text += f"  Instructions: {med.get('instructions')}\n"

        # 2️⃣ Build conversation context (last 4 messages)
        conversation_context = ""
        for msg in request.conversationHistory[-4:]:
            role = "USER" if msg.get("role") == "user" else "ASSISTANT"
            conversation_context += f"{role}: {msg.get('content', '')}\n"

        # 3️⃣ Create strict system prompt
        system_prompt = f"""
You are a medicine assistant for visually impaired users.
You MUST ONLY answer questions about medicines listed below.
If a question is about a medicine not listed, reply:
'That medicine is not in your prescription.'

{medicines_text}

Conversation history:
{conversation_context if conversation_context else 'Start of conversation'}
"""

        # 4️⃣ Call Gemini API
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            [system_prompt, f"\nUSER QUESTION: {request.message}"],
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=300,
                temperature=0.0,
            )
        )

        return ChatResponse(
            success=True,
            response=response.text.strip(),
            error=None
        )

    except Exception as e:
        print(f"Chat Error: {e}")
        return ChatResponse(
            success=False,
            response="Sorry, an error occurred while processing your request.",
            error=str(e)
        )

# ===== END CHATBOT ENDPOINT =====