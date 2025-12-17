# Importing from the chunk module since they share the same base models
# In a real implementation, these would be in a shared models base
from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum
from uuid import UUID4 as PydanticUUID4


class Citation(BaseModel):
    chapter: str
    page: int
    paragraph: int
    text: str  # The cited text passage


class QueryType(str, Enum):
    general = "general"
    selection = "selection"


class QueryBase(BaseModel):
    question: str = Field(..., min_length=1)
    response: str = Field(..., min_length=1)
    session_id: PydanticUUID4
    source_citations: List[Citation] = []  # List of citation objects
    accuracy_metric: float = Field(..., ge=0.0, le=1.0)  # Between 0 and 1
    query_type: QueryType  # Enum: general or selection


class QueryCreate(QueryBase):
    pass


class Query(QueryBase):
    id: PydanticUUID4
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True