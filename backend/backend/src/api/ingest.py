from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import UUID4
from typing import Optional
import logging
from ..services.ingestion_service import IngestionService


# Define request/response models
from pydantic import BaseModel


class IngestRequest(BaseModel):
    book_id: UUID4
    title: str
    content: str


class IngestResponse(BaseModel):
    message: str
    chunks_processed: int
    status: str  # Enum: success, partial, failed


router = APIRouter()
ingestion_service = IngestionService()
logger = logging.getLogger(__name__)


@router.post("/", response_model=IngestResponse)
async def ingest_book(
    book_id: str = Form(...),
    title: str = Form(...),
    content: str = Form(...)
):
    """
    Ingest book content to be processed and indexed for retrieval.
    """
    try:
        logger.info(f"Starting ingestion for book: {title} (ID: {book_id})")
        
        # Validate inputs
        if not title or not title.strip():
            raise HTTPException(status_code=400, detail="Book title is required")
        
        if not content or len(content.strip()) < 100:
            raise HTTPException(status_code=400, detail="Book content is required and must be meaningful")
        
        # Process the ingestion
        result = await ingestion_service.ingest_book_content(
            book_id=book_id,
            title=title,
            content=content
        )
        
        logger.info(f"Ingestion completed for book {book_id}: {result['status']}")
        return IngestResponse(
            message=result["message"],
            chunks_processed=result["chunks_processed"],
            status=result["status"]
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error ingesting book content: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while ingesting the book content"
        )