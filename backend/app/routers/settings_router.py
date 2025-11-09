# # app/routers/settings_router.py
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from app.services.db_service import get_db
# from app.schemas.settings_schema import SettingsResponse, SettingsUpdate
# from app.services.settings_service import get_or_create_settings, update_user_settings
# from app.dependencies import CurrentUser #

# router = APIRouter(prefix="/settings", tags=["settings"])

# @router.get("/", response_model=SettingsResponse)
# def get_settings(
#     user_id: CurrentUser, # Dependency to get user ID
#     db: Session = Depends(get_db)
# ):
#     """Fetch the current user's settings, creating default ones if necessary."""
#     settings = get_or_create_settings(db, user_id)
#     return settings

# @router.put("/", response_model=SettingsResponse)
# def save_settings(
#     settings_data: SettingsUpdate,
#     user_id: CurrentUser, # Dependency to get user ID
#     db: Session = Depends(get_db)
# ):
#     """Update the current user's settings."""
#     try:
#         updated_settings = update_user_settings(db, user_id, settings_data)
#         return updated_settings
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to save settings: {str(e)}"
#         )

# app/routers/settings_router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.services.db_service import get_db
from app.schemas.settings_schema import SettingsResponse, SettingsUpdate
from app.services.settings_service import get_or_create_settings, update_user_settings, export_user_data, generate_pdf_report # UPDATED IMPORT
from app.dependencies import CurrentUser 

# NEW IMPORTS for Export
from fastapi.responses import StreamingResponse
import io 
import json
from datetime import datetime
# END NEW IMPORTS

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=SettingsResponse)
def get_settings(
    user_id: CurrentUser, # Dependency to get user ID
    db: Session = Depends(get_db)
):
    """Fetch the current user's settings, creating default ones if necessary."""
    settings = get_or_create_settings(db, user_id)
    return settings

@router.put("/", response_model=SettingsResponse)
def save_settings(
    settings_data: SettingsUpdate,
    user_id: CurrentUser, # Dependency to get user ID
    db: Session = Depends(get_db)
):
    """Update the current user's settings."""
    try:
        updated_settings = update_user_settings(db, user_id, settings_data)
        return updated_settings
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save settings: {str(e)}"
        )

# UPDATED ENDPOINT: Data Export
@router.get("/export")
def export_data(
    user_id: CurrentUser, # Dependency to get user ID
    db: Session = Depends(get_db)
):
    """Export all user prescription and medicine data as a valid PDF file."""
    try:
        # 1. Fetch structured data
        structured_data = export_user_data(db, user_id)
        
        # 2. Generate the PDF binary data
        pdf_bytes = generate_pdf_report(structured_data)
        
        # 3. Use io.BytesIO for streaming the binary PDF data
        response_stream = io.BytesIO(pdf_bytes)
        
        # 4. Create a filename with the .pdf extension
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        filename = f"prescription_report_user_{user_id}_{timestamp}.pdf"
        
        # 5. Return StreamingResponse
        return StreamingResponse(
            response_stream,
            # IMPORTANT: Use the correct MIME type for PDF
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}", 
                "Access-Control-Expose-Headers": "Content-Disposition", 
            }
        )

    except Exception as e:
        print(f"Data export error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export data: {str(e)}"
        )