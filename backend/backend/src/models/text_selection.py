from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional
from uuid import UUID4 as PydanticUUID4


class TextSelectionBase(BaseModel):
    content: str = Field(..., max_length=10000)  # Max 10,000 characters
    context: str  # Surrounding context of selection
    query_id: Optional[PydanticUUID4] = None  # Foreign Key to Query, nullable


class TextSelectionCreate(TextSelectionBase):
    pass


class TextSelectionUpdate(BaseModel):
    content: Optional[str] = Field(None, max_length=10000)
    context: Optional[str] = None


class TextSelection(TextSelectionBase):
    id: PydanticUUID4
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True