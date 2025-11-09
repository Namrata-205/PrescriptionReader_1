# app/models/settings_model.py
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.services.db_service import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Accessibility Settings fields
    font_size = Column(String, default="medium", nullable=False) # e.g., 'small', 'medium', 'large'
    auto_play_tts = Column(Boolean, default=True, nullable=False)
    voice_speed = Column(Float, default=1.0, nullable=False)
    voice_pitch = Column(Float, default=1.0, nullable=False)

    # owner = relationship("User", back_populates="settings")