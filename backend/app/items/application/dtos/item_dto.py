from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class TagInItemDTO(BaseModel):
    """Simplified Tag DTO for inclusion in Item responses"""

    id: int
    name: str
    color: str

    class Config:
        from_attributes = True


class ItemDTO(BaseModel):
    """DTO for Item responses"""

    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    tags: List[TagInItemDTO] = []

    class Config:
        from_attributes = True


class ItemCreateDTO(BaseModel):
    """DTO for creating items"""

    name: str
    description: Optional[str] = None
    tag_ids: List[int] = []


class ItemUpdateDTO(BaseModel):
    """DTO for updating items"""

    name: Optional[str] = None
    description: Optional[str] = None
    tag_ids: Optional[List[int]] = None
