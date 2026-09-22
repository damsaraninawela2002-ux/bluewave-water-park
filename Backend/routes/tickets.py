from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from database.db import tickets_collection
from models.ticket import TicketCreate, TicketUpdate, TicketResponse
from utils.dependencies import require_admin

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def format_ticket(doc: dict) -> dict:
    """Format MongoDB ticket document into response dict with string id."""
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "price": float(doc.get("price", 0.0)),
        "description": doc.get("description", ""),
    }


@router.get("", response_model=List[TicketResponse])
@router.get("/", response_model=List[TicketResponse], include_in_schema=False)
async def get_tickets():
    """Public: List all available ticket types."""
    try:
        tickets = []
        async for item in tickets_collection.find():
            tickets.append(format_ticket(item))

        if not tickets:
            from seed import SAMPLE_TICKETS
            for i, item in enumerate(SAMPLE_TICKETS):
                c_item = dict(item)
                c_item["id"] = f"sample_ticket_{i+1}"
                tickets.append(c_item)
        return tickets
    except Exception as e:
        print(f"[Database Error in Tickets]: {e}")
        from seed import SAMPLE_TICKETS
        return [dict(item, id=f"sample_ticket_{i+1}") for i, item in enumerate(SAMPLE_TICKETS)]


@router.get("/{id}", response_model=TicketResponse)
async def get_ticket(id: str):
    """Public: Get a single ticket type by ID."""
    if id.startswith("sample_ticket_"):
        from seed import SAMPLE_TICKETS
        idx = int(id.replace("sample_ticket_", "")) - 1
        if 0 <= idx < len(SAMPLE_TICKETS):
            return dict(SAMPLE_TICKETS[idx], id=id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket ID format")

    doc = await tickets_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return format_ticket(doc)


@router.post("", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_ticket(ticket_in: TicketCreate, admin: dict = Depends(require_admin)):
    """Admin only: Create a new ticket type."""
    doc = ticket_in.model_dump()
    result = await tickets_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return format_ticket(doc)


@router.put("/{id}", response_model=TicketResponse)
async def update_ticket(id: str, update_in: TicketUpdate, admin: dict = Depends(require_admin)):
    """Admin only: Update an existing ticket type."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket ID format")

    update_data = {k: v for k, v in update_in.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")

    result = await tickets_collection.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return format_ticket(result)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_ticket(id: str, admin: dict = Depends(require_admin)):
    """Admin only: Delete a ticket type."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket ID format")

    result = await tickets_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return {"status": "Success", "message": "Ticket deleted successfully"}