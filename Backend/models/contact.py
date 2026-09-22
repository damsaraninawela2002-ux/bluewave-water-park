from typing import Literal
from pydantic import BaseModel, Field, EmailStr

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Sender full name")
    email: EmailStr = Field(..., description="Valid contact email address")
    subject: str = Field(..., min_length=3, max_length=150, description="Message subject")
    message: str = Field(..., min_length=10, max_length=2000, description="Detailed inquiry message")

class ContactMessageResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    status: Literal["new", "read"]
    createdAt: str
