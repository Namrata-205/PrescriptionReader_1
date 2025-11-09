# app/models/medicine_model.py
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.services.db_service import Base 

class Prescription(Base):
    """Represents a single prescription upload event."""
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    raw_text = Column(String) # Raw OCR output
    
    # Relationship to individual medicine entries
    medicines = relationship("Medicine", back_populates="prescription", cascade="all, delete-orphan")

class Medicine(Base):
    """Represents a single medicine extracted from a prescription."""
    __tablename__ = "medicines"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    
    # Extracted fields
    medicine_name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    instructions = Column(String)
    
    # Relationship back to Prescription
    prescription = relationship("Prescription", back_populates="medicines")