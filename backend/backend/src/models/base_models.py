from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, UUID4, Field
from uuid import UUID


class Chunk(BaseModel):
    id: UUID4 = Field(default_factory=UUID4)
    text_content: str = Field(..., max_length=512)  # Max 512 tokens
    metadata: dict = Field(...)  # Contains chapter, page, paragraph, book_id, etc.
    embedding_reference: str  # ID in Qdrant
    book_id: UUID4
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "text_content": "The main concept discussed in this section...",
                "metadata": {
                    "chapter": "Chapter 3",
                    "page": 45,
                    "paragraph": 2,
                    "book_id": "123e4567-e89b-12d3-a456-426614174001"
                },
                "embedding_reference": "qdrant_vector_id_123",
                "book_id": "123e4567-e89b-12d3-a456-426614174001",
                "created_at": "2023-10-20T10:00:00Z",
                "updated_at": "2023-10-20T10:00:00Z"
            }
        }


class Citation(BaseModel):
    chapter: str
    page: int
    paragraph: int
    text: str  # The cited text passage


class Query(BaseModel):
    id: UUID4 = Field(default_factory=UUID4)
    question: str = Field(..., min_length=1)
    response: str = Field(..., min_length=1)
    session_id: UUID4
    source_citations: List[Citation] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    accuracy_metric: float = Field(..., ge=0.0, le=1.0)  # Between 0 and 1
    query_type: str = Field(..., pattern="^(general|selection)$")  # Enum: general or selection
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174002",
                "question": "What is the main theme of this book?",
                "response": "The main theme of the book is the exploration of human consciousness...",
                "session_id": "123e4567-e89b-12d3-a456-426614174003",
                "source_citations": [
                    {
                        "chapter": "Chapter 3",
                        "page": 45,
                        "paragraph": 2,
                        "text": "The main character realizes that..."
                    }
                ],
                "timestamp": "2023-10-20T10:00:00Z",
                "accuracy_metric": 0.87,
                "query_type": "general"
            }
        }


class TextSelection(BaseModel):
    id: UUID4 = Field(default_factory=UUID4)
    content: str = Field(..., max_length=10000)  # Max 10,000 characters
    context: str  # Surrounding context of selection
    query_id: Optional[UUID4] = None  # Foreign Key to Query, nullable
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174004",
                "content": "The concept of relativity states that...",
                "context": "In the previous paragraph, we discussed Newtonian physics. The concept of relativity states that...",
                "query_id": "123e4567-e89b-12d3-a456-426614174002",
                "created_at": "2023-10-20T10:00:00Z"
            }
        }


class Session(BaseModel):
    id: UUID4 = Field(default_factory=UUID4)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    ended_at: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174003",
                "started_at": "2023-10-20T10:00:00Z",
                "last_activity": "2023-10-20T10:05:00Z",
                "user_agent": "Mozilla/5.0...",
                "ip_address": "192.168.1.1",
                "ended_at": None
            }
        }