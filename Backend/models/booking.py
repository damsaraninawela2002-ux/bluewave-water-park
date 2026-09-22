from typing import Optional, Literal
from pydantic import BaseModel, Field, field_validator
from datetime import date

BookingStatus = Literal["pending", "confirmed", "cancelled"]


class BookingCreate(BaseModel):
    ticketType: str = Field(..., min_length=2, description="Type/name of the ticket to book (e.g. Adult, Child, Family)")
    visitDate: str = Field(..., description="Visit date in YYYY-MM-DD format")
    quantity: int = Field(..., ge=1, le=20, description="Quantity between 1 and 20")

    @field_validator("visitDate")
    @classmethod
    def validate_visit_date(cls, v: str) -> str:
        try:
            parsed = date.fromisoformat(v)
        except ValueError:
            raise ValueError("visitDate must be a valid date in YYYY-MM-DD format")
        if parsed < date.today():
            raise ValueError("visitDate cannot be in the past")
        return v


class BookingStatusUpdate(BaseModel):
    bookingStatus: Optional[Literal["confirmed", "cancelled"]] = Field(None, description="New status for the booking")
    status: Optional[Literal["confirmed", "cancelled"]] = Field(None, description="Legacy alias for bookingStatus")


class BookingResponse(BaseModel):
    id: str
    userId: str
    ticketType: str
    visitDate: str
    quantity: int
    pricePerTicket: float
    totalPrice: float
    bookingStatus: BookingStatus
    createdAt: Optional[str] = None
    bookingId: Optional[str] = None
    userName: Optional[str] = None
    userEmail: Optional[str] = None

    # Backward compatibility aliases
    totalAmount: Optional[float] = None
    status: Optional[str] = None
    ticketName: Optional[str] = None
    ticketPrice: Optional[float] = None
