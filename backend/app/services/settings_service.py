# # app/services/settings_service.py
# from sqlalchemy.orm import Session
# from app.models.settings_model import UserSettings
# from app.schemas.settings_schema import SettingsUpdate
# from app.services.db_service import SessionLocal 
# from typing import Optional

# def get_or_create_settings(db: Session, user_id: int) -> UserSettings:
#     """Fetches user settings or creates a default entry if none exists."""
#     settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
#     if settings is None:
#         # Create default settings
#         default_settings = UserSettings(
#             user_id=user_id,
#             font_size="medium",
#             auto_play_tts=True,
#             voice_speed=1.0,
#             voice_pitch=1.0
#         )
#         db.add(default_settings)
#         db.commit()
#         db.refresh(default_settings)
#         settings = default_settings
        
#     return settings

# def update_user_settings(db: Session, user_id: int, settings_data: SettingsUpdate) -> UserSettings:
#     """Updates existing user settings."""
#     settings = get_or_create_settings(db, user_id)
    
#     # Update fields from the Pydantic model
#     settings.font_size = settings_data.font_size
#     settings.auto_play_tts = settings_data.auto_play_tts
#     settings.voice_speed = settings_data.voice_speed
#     settings.voice_pitch = settings_data.voice_pitch
    
#     db.commit()
#     db.refresh(settings)
#     return settings

# app/services/settings_service.py
from sqlalchemy.orm import Session
from app.models.settings_model import UserSettings
from app.schemas.settings_schema import SettingsUpdate
from app.services.db_service import SessionLocal 
from typing import Optional

from app.models.medicine_model import Prescription, Medicine
from sqlalchemy.orm import joinedload
from datetime import datetime
from app.models.user_model import User # NEW IMPORT

# --- PDF IMPORTS ---
from fpdf import FPDF 
import io
# -----------------------

def get_or_create_settings(db: Session, user_id: int) -> UserSettings:
    """Fetches user settings or creates a default entry if none exists."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
    if settings is None:
        # Create default settings
        default_settings = UserSettings(
            user_id=user_id,
            font_size="medium",
            auto_play_tts=True,
            voice_speed=1.0,
            voice_pitch=1.0
        )
        db.add(default_settings)
        db.commit()
        db.refresh(default_settings)
        settings = default_settings
        
    return settings

def update_user_settings(db: Session, user_id: int, settings_data: SettingsUpdate) -> UserSettings:
    """Updates existing user settings."""
    settings = get_or_create_settings(db, user_id)
    
    # Update fields from the Pydantic model
    settings.font_size = settings_data.font_size
    settings.auto_play_tts = settings_data.auto_play_tts
    settings.voice_speed = settings_data.voice_speed
    settings.voice_pitch = settings_data.voice_pitch
    
    db.commit()
    db.refresh(settings)
    return settings

def export_user_data(db: Session, user_id: int):
    """Fetches all prescription and medicine data for the user."""
    
    # NEW: Fetch user's name
    user = db.query(User).filter(User.id == user_id).first()
    user_name = user.name if user else "Unknown User"
    
    # Query all prescriptions for the user, eagerly loading the related medicines
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.user_id == user_id)
        .options(joinedload(Prescription.medicines))
        .order_by(Prescription.upload_date.desc())
        .all()
    )

    export_data = {
        "user_id": user_id,
        "user_name": user_name, # ADDED: Pass user name to PDF generator
        "export_date": datetime.utcnow().isoformat(),
        "prescriptions": []
    }

    for prescription in prescriptions:
        prescription_data = {
            "prescription_id": prescription.id,
            "upload_date": prescription.upload_date.isoformat(),
            "raw_ocr_text": prescription.raw_text, # Kept for data completeness, ignored by PDF generator
            "medicines": []
        }
        
        for medicine in prescription.medicines:
            prescription_data["medicines"].append({
                "medicine_id": medicine.id,
                "medicine_name": medicine.medicine_name,
                "dosage": medicine.dosage,
                "frequency": medicine.frequency,
                "duration": medicine.duration,
                "instructions": medicine.instructions,
            })
            
        export_data["prescriptions"].append(prescription_data)

    return export_data

def generate_pdf_report(data: dict) -> bytes:
    """Creates a structured PDF document from the user's data."""
    pdf = FPDF(unit="mm", format="A4")
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    
    # Title
    pdf.cell(0, 10, "PRESCRIPTION READER DATA EXPORT", 0, 1, "C")
    pdf.set_font("Arial", "", 10)
    
    # FIX: Print User Name instead of ID
    pdf.cell(0, 5, f"User: {data.get('user_name', 'N/A')}", 0, 1, 'L') 
    pdf.cell(0, 5, f"Export Date: {data['export_date']}", 0, 1, 'L')
    pdf.ln(5)
    
    # Prescriptions Section
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, "PRESCRIPTIONS", 0, 1, "L")
    pdf.set_font("Arial", "", 10)

    if not data['prescriptions']:
        pdf.cell(0, 10, "No prescription records found.", 0, 1, 'L') 

    for i, p in enumerate(data['prescriptions']):
        pdf.set_fill_color(220, 220, 220)
        pdf.set_font("Arial", "B", 10)
        pdf.cell(0, 7, f"--- PRESCRIPTION {i+1} ({p['upload_date'].split('T')[0]}) ---", 0, 1, 'L', 1) 
        pdf.set_font("Arial", "", 10)
        pdf.cell(0, 5, "MEDICINES:", 0, 1, 'L')
        
        for j, m in enumerate(p['medicines']):
            pdf.set_font("Arial", "B", 10)
            pdf.cell(0, 5, f"  {j+1}. {m['medicine_name']}", 0, 1, 'L') 
            pdf.set_font("Arial", "", 9)
            pdf.cell(0, 4, f"     Dosage: {m['dosage'] or 'N/A'}", 0, 1, 'L') 
            pdf.cell(0, 4, f"     Frequency: {m['frequency'] or 'N/A'}", 0, 1, 'L') 
            pdf.cell(0, 4, f"     Duration: {m['duration'] or 'N/A'}", 0, 1, 'L') 
            
            pdf.multi_cell(0, 4, f"     Instructions: {m['instructions'] or 'N/A'}", 0, 'L') 
            pdf.ln(1)
        
        # FIX: REMOVED RAW OCR SNIPPET SECTION ENTIRELY
        # The section below was removed:
        # pdf.set_font("Arial", "I", 8)
        # pdf.multi_cell(0, 4, f"Raw OCR Snippet: {(p['raw_ocr_text'][:250].replace('\n', ' ') + '...') if p['raw_ocr_text'] else 'N/A'}", 0, 'L') 
        # pdf.ln(5)
        
    # Output the PDF to a binary buffer
    return pdf.output(dest='S')