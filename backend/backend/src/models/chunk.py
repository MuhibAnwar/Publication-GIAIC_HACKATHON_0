from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class ChunkBase(BaseModel):
    text_content: str = Field(..., max_length=512)  # Max 512 tokens
    metadata: dict = Field(...)  # Contains chapter, page, paragraph, book_id, etc.
    embedding_reference: str  # ID in Qdrant
    book_id: UUID4


class ChunkCreate(ChunkBase):
    pass


class Chunk(ChunkBase):
    id: UUID4
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class QueryType(str, Enum):
    general = "general"
    selection = "selection"


class QueryBase(BaseModel):
    question: str = Field(..., min_length=1)
    response: str = Field(..., min_length=1)
    session_id: UUID4
    source_citations: List[dict] = []  # List of citation objects
    accuracy_metric: float = Field(..., ge=0.0, le=1.0)  # Between 0 and 1
    query_type: QueryType  # Enum: general or selection


class QueryCreate(QueryBase):
    pass


class Query(QueryBase):
    id: UUID4
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class SessionBase(BaseModel):
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class Session(SessionBase):
    id: UUID4
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True