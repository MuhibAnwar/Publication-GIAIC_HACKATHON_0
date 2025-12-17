from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from typing import Optional
from uuid import UUID4 as PydanticUUID4


class SessionBase(BaseModel):
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class Session(SessionBase):
    id: PydanticUUID4
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None

    class Config:
        from_attributes = True