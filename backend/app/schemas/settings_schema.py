# app/schemas/settings_schema.py
from pydantic import BaseModel, Field

# Schema for creating or updating settings (Request Body)
class SettingsUpdate(BaseModel):
    font_size: str = Field(..., description="Font size choice: small, medium, large, xlarge")
    auto_play_tts: bool
    voice_speed: float = Field(..., ge=0.5, le=2.0)
    voice_pitch: float = Field(..., ge=0.5, le=2.0)

# Schema for reading settings (Response Body)
class SettingsResponse(BaseModel):
    font_size: str
    auto_play_tts: bool
    voice_speed: float
    voice_pitch: float
    
    class Config:
        orm_mode = True