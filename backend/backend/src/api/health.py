from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str  # Enum: healthy, degraded, unhealthy
    timestamp: str
    details: Dict[str, Any] = {}


router = APIRouter()


@router.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat()
    )