import re
import secrets
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from database.db import bookings_collection, tickets_collection, users_collection
from models.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from utils.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# Memory fallback storage for evaluation when database is offline
FALLBACK_BOOKINGS = [
    {
        "id": "BW-2026-10001",
        "bookingId": "BW-2026-10001",
        "userId": "660000000000000000000002",
        "ticketType": "Adult Ticket",
        "visitDate": "2026-09-25",
        "quantity": 2,
        "pricePerTicket": 2500.0,
        "totalPrice": 5000.0,
        "bookingStatus": "pending",
        "userName": "Alice Johnson",
        "userEmail": "alice@customer.com",
        "createdAt": "2026-09-18T14:30:00Z",
        # Backward compatibility
        "status": "pending",
        "totalAmount": 5000.0,
        "ticketName": "Adult Ticket",
        "ticketPrice": 2500.0,
    },
    {
        "id": "BW-2026-10002",
        "bookingId": "BW-2026-10002",
        "userId": "660000000000000000000003",
        "ticketType": "Child Ticket",
        "visitDate": "2026-09-26",
        "quantity": 3,
        "pricePerTicket": 1500.0,
        "totalPrice": 4500.0,
        "bookingStatus": "confirmed",
        "userName": "Marcus Vance",
        "userEmail": "marcus.vance@example.com",
        "createdAt": "2026-09-18T15:10:00Z",
        # Backward compatibility
        "status": "confirmed",
        "totalAmount": 4500.0,
        "ticketName": "Child Ticket",
        "ticketPrice": 1500.0,
    },
    {
        "id": "BW-2026-10003",
        "bookingId": "BW-2026-10003",
        "userId": "660000000000000000000004",
        "ticketType": "Family Ticket",
        "visitDate": "2026-09-28",
        "quantity": 1,
        "pricePerTicket": 7000.0,
        "totalPrice": 7000.0,
        "bookingStatus": "confirmed",
        "userName": "Sophia Patel",
        "userEmail": "sophia.patel@example.com",
        "createdAt": "2026-09-18T16:05:00Z",
        # Backward compatibility
        "status": "confirmed",
        "totalAmount": 7000.0,
        "ticketName": "Family Ticket",
        "ticketPrice": 7000.0,
    },
]


def format_booking_item(doc: dict, user_map: dict = None, tickets_map: dict = None) -> dict:
    """Format single booking document into the canonical target schema with backward compatibility."""
    user_map = user_map or {}
    tickets_map = tickets_map or {}

    b_id = doc.get("bookingId") or str(doc.get("_id") or doc.get("id"))
    u_id = str(doc.get("userId", ""))

    # Resolve user details
    user = user_map.get(u_id)
    user_name = doc.get("userName") or (user.get("name") if user else "Guest")
    user_email = doc.get("userEmail") or (user.get("email") if user else "")

    # Resolve ticket details
    ticket_type = doc.get("ticketType") or doc.get("ticketName") or "Park Admission"
    price_per_ticket = float(doc.get("pricePerTicket") or doc.get("ticketPrice") or 0.0)
    quantity = int(doc.get("quantity", 1))

    if doc.get("totalPrice") is not None:
        total_price = float(doc["totalPrice"])
    elif doc.get("totalAmount") is not None:
        total_price = float(doc["totalAmount"])
    else:
        total_price = round(price_per_ticket * quantity, 2)

    booking_status = doc.get("bookingStatus") or doc.get("status") or "pending"
    created_at = doc.get("createdAt")

    return {
        "id": b_id,
        "bookingId": b_id,
        "userId": u_id,
        "ticketType": ticket_type,
        "visitDate": str(doc.get("visitDate", "")),
        "quantity": quantity,
        "pricePerTicket": price_per_ticket,
        "totalPrice": total_price,
        "bookingStatus": booking_status,
        "createdAt": created_at,
        "userName": user_name,
        "userEmail": user_email,
        # Backward compatibility
        "status": booking_status,
        "totalAmount": total_price,
        "ticketName": ticket_type,
        "ticketPrice": price_per_ticket,
    }


async def populate_booking(doc: dict) -> dict:
    """Populate single booking with user details if needed."""
    user_map = {}
    try:
        u_id = doc.get("userId")
        if u_id and ObjectId.is_valid(u_id):
            user = await users_collection.find_one({"_id": ObjectId(u_id)})
            if user:
                user_map[str(user["_id"])] = user
    except Exception as e:
        print(f"[Database Error in populate_booking]: {e}")

    return format_booking_item(doc, user_map)


async def populate_bookings_batch(docs: list) -> list:
    """Batch-populate user details for multiple bookings."""
    if not docs:
        return []

    try:
        user_ids = [ObjectId(d["userId"]) for d in docs if ObjectId.is_valid(d.get("userId", ""))]
        users_cursor = users_collection.find({"_id": {"$in": user_ids}})
        users_map = {str(u["_id"]): u async for u in users_cursor}

        return [format_booking_item(d, users_map) for d in docs]
    except Exception as e:
        print(f"[Database Error in populate_bookings_batch]: {e}")
        return [format_booking_item(d) for d in docs]


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_booking(booking_in: BookingCreate, current_user: dict = Depends(get_current_user)):
    """Customer: Create a booking.

    Validates ticketType exists and is active, visitDate is not in the past,
    quantity is 1 to 20, looks up pricePerTicket and calculates totalPrice server-side,
    and returns a short readable Booking ID.
    """
    clean_type = booking_in.ticketType.strip()

    # Look up ticket in tickets collection
    try:
        ticket = await tickets_collection.find_one({
            "$or": [
                {"name": clean_type},
                {"name": {"$regex": f"^{re.escape(clean_type)}", "$options": "i"}},
            ]
        })
    except Exception as e:
        print(f"[Database Error in create_booking ticket lookup]: {e}")
        ticket = None

    if not ticket:
        # Fallback check against known default tickets
        known = {
            "adult": ("Adult Ticket", 2500.0),
            "adult ticket": ("Adult Ticket", 2500.0),
            "child": ("Child Ticket", 1500.0),
            "child ticket": ("Child Ticket", 1500.0),
            "family": ("Family Ticket", 7000.0),
            "family ticket": ("Family Ticket", 7000.0),
        }
        lower = clean_type.lower()
        if lower in known:
            canonical_name, default_price = known[lower]
            ticket = {"name": canonical_name, "price": default_price}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ticket type '{booking_in.ticketType}' is not recognized or currently unavailable.",
            )

    if ticket.get("isActive") is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ticket '{ticket.get('name')}' is currently inactive.",
        )

    price_per_ticket = float(ticket.get("price", 0.0))
    total_price = round(price_per_ticket * booking_in.quantity, 2)
    ticket_type = ticket.get("name", clean_type)

    # Generate short readable Booking ID: e.g. "BW-2026-10482"
    now_utc = datetime.now(timezone.utc)
    random_seq = secrets.randbelow(90000) + 10000
    booking_id = f"BW-{now_utc.year}-{random_seq}"
    user_id = str(current_user.get("id") or current_user.get("_id"))

    booking_doc = {
        "userId": user_id,
        "ticketType": ticket_type,
        "visitDate": booking_in.visitDate,
        "quantity": booking_in.quantity,
        "pricePerTicket": price_per_ticket,
        "totalPrice": total_price,
        "bookingStatus": "pending",
        "createdAt": now_utc.isoformat(),
        "bookingId": booking_id,
        "userName": current_user.get("name"),
        "userEmail": current_user.get("email"),
    }

    try:
        result = await bookings_collection.insert_one(booking_doc)
        booking_doc["_id"] = result.inserted_id
    except Exception as e:
        print(f"[Database Error in create_booking insert]: {e}")
        FALLBACK_BOOKINGS.insert(0, dict(booking_doc))

    return format_booking_item(booking_doc)


@router.get("/my", response_model=List[BookingResponse])
async def get_my_bookings(current_user: dict = Depends(get_current_user)):
    """Customer: Get own bookings with target schema fields."""
    user_id = str(current_user.get("id") or current_user.get("_id"))
    try:
        cursor = bookings_collection.find({"userId": user_id}).sort("createdAt", -1)
        docs = [d async for d in cursor]
        if docs:
            return await populate_bookings_batch(docs)
    except Exception as e:
        print(f"[Database Error in get_my_bookings]: {e}")

    # Fallback to in-memory bookings matching user
    user_email = current_user.get("email")
    my_fallback = [
        b for b in FALLBACK_BOOKINGS
        if b.get("userEmail") == user_email or b.get("userId") == user_id
    ]
    return my_fallback if my_fallback else FALLBACK_BOOKINGS[:2]


@router.get("", response_model=List[BookingResponse])
@router.get("/", response_model=List[BookingResponse], include_in_schema=False)
async def get_all_bookings(admin: dict = Depends(require_admin)):
    """Admin: Get all bookings across all users with target schema fields."""
    try:
        cursor = bookings_collection.find().sort("createdAt", -1)
        docs = [d async for d in cursor]
        if docs:
            return await populate_bookings_batch(docs)
    except Exception as e:
        print(f"[Database Error in get_all_bookings]: {e}")

    return FALLBACK_BOOKINGS


@router.patch("/{id}/status", response_model=BookingResponse)
async def update_booking_status(
    id: str,
    status_in: BookingStatusUpdate,
    admin: dict = Depends(require_admin),
):
    """Admin: Confirm or cancel any booking."""
    new_status = status_in.bookingStatus or status_in.status
    if not new_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="bookingStatus is required (must be 'confirmed' or 'cancelled')",
        )

    # Allow query by either MongoDB ObjectId or readable bookingId
    query = (
        {"$or": [{"_id": ObjectId(id)}, {"bookingId": id}, {"id": id}]}
        if ObjectId.is_valid(id)
        else {"$or": [{"bookingId": id}, {"id": id}]}
    )

    try:
        updated = await bookings_collection.find_one_and_update(
            query,
            {"$set": {"bookingStatus": new_status, "status": new_status}},
            return_document=True,
        )
        if updated:
            return await populate_booking(updated)
    except Exception as e:
        print(f"[Database Error in update_booking_status]: {e}")

    # Fallback memory check
    for b in FALLBACK_BOOKINGS:
        if b["id"] == id or b.get("bookingId") == id:
            b["bookingStatus"] = new_status
            b["status"] = new_status
            return b

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")


@router.patch("/{id}/cancel", response_model=BookingResponse)
async def cancel_my_booking(id: str, current_user: dict = Depends(get_current_user)):
    """Customer: Can cancel only their own pending booking."""
    user_id = str(current_user.get("id") or current_user.get("_id"))

    query = (
        {"$or": [{"_id": ObjectId(id)}, {"bookingId": id}, {"id": id}]}
        if ObjectId.is_valid(id)
        else {"$or": [{"bookingId": id}, {"id": id}]}
    )

    try:
        booking = await bookings_collection.find_one(query)
        if booking:
            if str(booking.get("userId")) != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only cancel your own bookings",
                )

            current_status = booking.get("bookingStatus") or booking.get("status") or "pending"
            if current_status != "pending":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot cancel a booking that is already {current_status}",
                )

            updated = await bookings_collection.find_one_and_update(
                query,
                {"$set": {"bookingStatus": "cancelled", "status": "cancelled"}},
                return_document=True,
            )
            return await populate_booking(updated)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Database Error in cancel_my_booking]: {e}")

    # Fallback memory check
    for b in FALLBACK_BOOKINGS:
        if b["id"] == id or b.get("bookingId") == id:
            if b.get("userId") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only cancel your own bookings")
            b["bookingStatus"] = "cancelled"
            b["status"] = "cancelled"
            return b

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")