from datetime import datetime
from typing import Optional


class Tag:
    """Domain entity representing a Tag"""

    def __init__(
        self,
        name: str,
        color: str,
        id: Optional[int] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id
        self.name = name
        self.color = color
        self.created_at = created_at
        self.updated_at = updated_at
