import time
from collections import defaultdict
from datetime import datetime, timezone
from typing import List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from database.db import messages_collection
from models.contact import ContactMessageCreate, ContactMessageResponse
from utils.dependencies import require_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

# In-memory IP rate limiter: 5 messages per IP per hour (3600 seconds)
RATE_LIMIT_WINDOW = 3600
MAX_REQUESTS_PER_WINDOW = 5
_ip_history = defaultdict(list)


def is_rate_limited(ip: str) -> bool:
    """Returns True if client IP has exceeded 5 messages in the past hour."""
    now = time.time()
    # Filter timestamps within current window
    _ip_history[ip] = [t for t in _ip_history[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(_ip_history[ip]) >= MAX_REQUESTS_PER_WINDOW:
        return True
    _ip_history[ip].append(now)
    return False


@router.post("", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def submit_contact_message(
    msg: ContactMessageCreate,
    request: Request,
):
    """
    Public: Submit a contact message.
    Protected by simple in-memory rate limiting of 5 messages per IP per hour.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"

    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. You may only send 5 contact messages per hour. Please try again later.",
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    new_doc = {
        "name": msg.name.strip(),
        "email": str(msg.email).strip().lower(),
        "subject": msg.subject.strip(),
        "message": msg.message.strip(),
        "status": "new",
        "createdAt": now_iso,
    }

    try:
        res = await messages_collection.insert_one(new_doc)
        new_doc["id"] = str(res.inserted_id)
        return new_doc
    except Exception as e:
        print(f"[Error saving contact message]: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again or reach out directly by phone.",
        )


@router.get("", response_model=List[ContactMessageResponse])
@router.get("/", response_model=List[ContactMessageResponse], include_in_schema=False)
async def get_all_messages(admin: dict = Depends(require_admin)):
    """Admin only: Fetch all contact inquiries, newest first."""
    try:
        messages = []
        async for doc in messages_collection.find().sort("createdAt", -1):
            doc["id"] = str(doc["_id"])
            messages.append(doc)
        return messages
    except Exception as e:
        print(f"[Error fetching contact messages]: {e}")
        return []


@router.get("/unread-count")
async def get_unread_count(admin: dict = Depends(require_admin)):
    """Admin only: Return count of unread messages for admin sidebar badge."""
    try:
        count = await messages_collection.count_documents({"status": "new"})
        return {"unreadCount": count}
    except Exception as e:
        print(f"[Error fetching unread message count]: {e}")
        return {"unreadCount": 0}


@router.patch("/{id}/read", response_model=ContactMessageResponse)
async def mark_message_read(
    id: str,
    admin: dict = Depends(require_admin),
):
    """Admin only: Mark an incoming inquiry as read."""
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid message ID format")

    res = await messages_collection.find_one_and_update(
        {"_id": oid},
        {"$set": {"status": "read"}},
        return_document=True,
    )
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    res["id"] = str(res["_id"])
    return res


@router.delete("/{id}")
async def delete_message(
    id: str,
    admin: dict = Depends(require_admin),
):
    """Admin only: Delete an inquiry message."""
    try:
        oid = ObjectId(id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid message ID format")

    res = await messages_collection.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    return {"status": "success", "message": "Message deleted successfully"}
