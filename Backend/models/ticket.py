from typing import Optional
from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Ticket type name (e.g. Adult, Child, Family)")
    price: float = Field(..., gt=0, description="Ticket price in USD")
    description: str = Field(..., min_length=5, description="Ticket description and inclusions")


class TicketUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, min_length=5)


class TicketResponse(BaseModel):
    id: str
    name: str
    price: float
    description: str
