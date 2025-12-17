from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import UUID4
from typing import List, Optional
import logging
from ..services.rag_service import RAGService
from ..core.rate_limit import rate_limit
from ..models.query import QueryType


# Define request/response models
from pydantic import BaseModel


class GeneralQueryRequest(BaseModel):
    question: str
    book_id: UUID4
    session_id: Optional[UUID4] = None


class SelectionQueryRequest(BaseModel):
    question: str 
    selected_text: str
    book_id: UUID4
    session_id: Optional[UUID4] = None


class CitationResponse(BaseModel):
    chapter: str
    page: int
    paragraph: int
    text: str


class QueryResponse(BaseModel):
    answer: str
    citations: List[CitationResponse]
    confidence_score: float
    query_id: Optional[UUID4] = None


router = APIRouter()
rag_service = RAGService()
logger = logging.getLogger(__name__)


@router.post("/general", response_model=QueryResponse)
@rate_limit(max_requests=50, window_size=60)  # 50 requests per minute per IP
async def query_general(
    request: Request,
    query_request: GeneralQueryRequest
):
    """
    Handle general queries about the entire book content.
    """
    try:
        # Log the incoming request
        client_ip = request.client.host
        logger.info(f"General query from {client_ip}: {query_request.question}")
        
        # Process the query using RAG service
        result = await rag_service.process_general_query(
            question=query_request.question,
            book_id=str(query_request.book_id),
            session_id=str(query_request.session_id) if query_request.session_id else "anonymous"
        )
        
        # Log successful response
        logger.info(f"Successfully processed general query for book {query_request.book_id}")
        
        return QueryResponse(
            answer=result["answer"],
            citations=result["citations"],
            confidence_score=result["confidence_score"]
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error processing general query: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your query"
        )


@router.post("/selection", response_model=QueryResponse)
@rate_limit(max_requests=50, window_size=60)  # 50 requests per minute per IP
async def query_selection(
    request: Request,
    query_request: SelectionQueryRequest
):
    """
    Handle queries about specifically selected text passages.
    """
    try:
        # Log the incoming request
        client_ip = request.client.host
        logger.info(f"Selection query from {client_ip}: {query_request.question}")
        
        # Process the query using RAG service
        result = await rag_service.process_selection_query(
            question=query_request.question,
            selected_text=query_request.selected_text,
            book_id=str(query_request.book_id),
            session_id=str(query_request.session_id) if query_request.session_id else "anonymous"
        )
        
        # Log successful response
        logger.info(f"Successfully processed selection query for book {query_request.book_id}")
        
        return QueryResponse(
            answer=result["answer"],
            citations=result["citations"],
            confidence_score=result["confidence_score"]
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error processing selection query: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your query"
        )