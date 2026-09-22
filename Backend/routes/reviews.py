from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Query
from database.db import reviews_collection, bookings_collection
from models.review import ReviewCreate, ReviewResponse, ReviewSummaryResponse
from utils.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("", response_model=List[ReviewResponse])
@router.get("/", response_model=List[ReviewResponse], include_in_schema=False)
async def get_reviews(limit: Optional[int] = Query(None, ge=1, le=100)):
    """Public: Fetch latest reviews sorted by newest first, with optional limit."""
    try:
        query = reviews_collection.find().sort("createdAt", -1)
        if limit:
            query = query.limit(limit)

        reviews = []
        async for doc in query:
            doc["id"] = str(doc["_id"])
            reviews.append(doc)
        return reviews
    except Exception as e:
        print(f"[Error in get_reviews]: {e}")
        return []


@router.get("/summary", response_model=ReviewSummaryResponse)
async def get_review_summary():
    """Public: Return calculated average rating, total reviews count, and count per star (1-5)."""
    try:
        total_reviews = await reviews_collection.count_documents({})
        star_counts = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}

        if total_reviews == 0:
            return {
                "averageRating": 0.0,
                "totalReviews": 0,
                "starCounts": star_counts,
            }

        pipeline = [
            {"$group": {"_id": "$rating", "count": {"$sum": 1}}},
        ]
        results = [doc async for doc in reviews_collection.aggregate(pipeline)]
        total_score = 0
        for r in results:
            key = str(r["_id"])
            if key in star_counts:
                star_counts[key] = r["count"]
                total_score += int(r["_id"]) * r["count"]

        avg = round(total_score / total_reviews, 1) if total_reviews > 0 else 0.0
        return {
            "averageRating": avg,
            "totalReviews": total_reviews,
            "starCounts": star_counts,
        }
    except Exception as e:
        print(f"[Error in get_review_summary]: {e}")
        return {
            "averageRating": 0.0,
            "totalReviews": 0,
            "starCounts": {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0},
        }


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_review(
    review_data: ReviewCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Customer: Submit a review.
    Restrictions:
    - User must have at least one booking with status 'confirmed'.
    - Only one review allowed per user.
    """
    user_id = str(current_user["id"])

    # 1. Check if user already reviewed
    existing_review = await reviews_collection.find_one({"userId": user_id})
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already submitted a review. Each guest may only submit one review.",
        )

    # 2. Check if user has at least one confirmed booking
    confirmed_booking = await bookings_collection.find_one(
        {"userId": user_id, "$or": [{"bookingStatus": "confirmed"}, {"status": "confirmed"}]}
    )
    if not confirmed_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only guests with at least one confirmed booking can leave a review. Please complete a visit first!",
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    new_doc = {
        "userId": user_id,
        "userName": current_user.get("name") or "Verified Guest",
        "rating": review_data.rating,
        "comment": review_data.comment.strip(),
        "createdAt": now_iso,
    }

    res = await reviews_collection.insert_one(new_doc)
    new_doc["id"] = str(res.inserted_id)
    return new_doc


@router.delete("/{id}")
async def delete_review(
    id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a review:
    - Admin can delete any review.
    - Customer can delete only their own review.
    """
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid review ID format")

    review = await reviews_collection.find_one({"_id": oid})
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    is_admin = current_user.get("role") == "admin"
    is_owner = str(review.get("userId")) == str(current_user["id"])

    if not is_admin and not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this review",
        )

    await reviews_collection.delete_one({"_id": oid})
    return {"status": "success", "message": "Review deleted successfully"}
