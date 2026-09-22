from typing import Dict
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Star rating from 1 to 5")
    comment: str = Field(..., min_length=10, max_length=500, description="Review feedback between 10 and 500 characters")

class ReviewResponse(BaseModel):
    id: str
    userId: str
    userName: str
    rating: int
    comment: str
    createdAt: str

class ReviewSummaryResponse(BaseModel):
    averageRating: float
    totalReviews: int
    starCounts: Dict[str, int]
