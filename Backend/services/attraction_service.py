import math
import re
from datetime import datetime, timezone
from typing import Optional, List, Union
from bson import ObjectId
from models.attraction import (
    AttractionCreate,
    AttractionUpdate,
    AttractionPatch,
    AttractionResponse,
    AttractionListResponse,
)
from repositories.attraction_repository import attraction_repository, AttractionRepository
from utils.exceptions import AppException


def format_attraction_doc(doc: dict) -> AttractionResponse:
    """Format MongoDB document into Pydantic AttractionResponse, tolerating older docs."""
    return AttractionResponse(
        id=str(doc.get("_id") or doc.get("id")),
        name=doc.get("name", ""),
        description=doc.get("description", ""),
        image=doc.get("image", ""),
        category=doc.get("category", "Water Slides"),
        isActive=doc.get("isActive", True),
        createdAt=doc.get("createdAt"),
        updatedAt=doc.get("updatedAt"),
    )


class AttractionService:
    def __init__(self, repository: AttractionRepository = None):
        self.repo = repository or attraction_repository

    async def list_attractions(
        self,
        page: Optional[int] = None,
        limit: Optional[int] = None,
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        sort: Optional[str] = "-createdAt",
        include_inactive: bool = False,
        is_admin: bool = False,
    ) -> Union[List[AttractionResponse], AttractionListResponse]:
        """List attractions with optional filtering, sorting, and pagination."""
        query = {}

        # 1. Active status filtering
        if status and isinstance(status, str):
            s_lower = status.strip().lower()
            if s_lower == "active":
                query["isActive"] = {"$ne": False}
            elif s_lower == "inactive":
                query["isActive"] = False
        else:
            # If not explicitly asked for all, and not admin with include_inactive, show only active
            if not is_admin and not include_inactive:
                query["isActive"] = {"$ne": False}
            elif not include_inactive and not status:
                # By default public list only active
                query["isActive"] = {"$ne": False}

        # 2. Category filtering
        if category and isinstance(category, str) and category.strip() and category.strip().lower() != "all":
            query["category"] = category.strip()

        # 3. Search query
        if search and isinstance(search, str) and search.strip():
            escaped = re.escape(search.strip())
            query["$or"] = [
                {"name": {"$regex": escaped, "$options": "i"}},
                {"description": {"$regex": escaped, "$options": "i"}},
            ]

        # Check if pagination is requested
        is_paginated = page is not None or limit is not None

        if not is_paginated:
            docs = await self.repo.find_all(query, sort_field=sort or "-createdAt")
            return [format_attraction_doc(d) for d in docs]

        # Handle pagination
        current_page = max(page or 1, 1)
        page_limit = min(max(limit or 10, 1), 100)
        skip = (current_page - 1) * page_limit

        total = await self.repo.count(query)
        docs = await self.repo.find_all(query, sort_field=sort or "-createdAt", skip=skip, limit=page_limit)
        total_pages = math.ceil(total / page_limit) if total > 0 else 1

        return AttractionListResponse(
            items=[format_attraction_doc(d) for d in docs],
            total=total,
            page=current_page,
            limit=page_limit,
            totalPages=total_pages,
        )

    async def get_attraction(self, id_str: str) -> AttractionResponse:
        """Get a single attraction by id."""
        if not ObjectId.is_valid(id_str):
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        doc = await self.repo.find_by_id(id_str)
        if not doc:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        return format_attraction_doc(doc)

    async def create_attraction(self, data: AttractionCreate) -> AttractionResponse:
        """Create a new attraction, validating unique case-insensitive name."""
        # Check duplicate name
        existing = await self.repo.find_by_name(data.name)
        if existing:
            raise AppException(
                status_code=409,
                detail=f"An attraction with name '{data.name}' already exists",
                code="DUPLICATE_NAME",
            )

        now_iso = datetime.now(timezone.utc).isoformat()
        doc = data.model_dump()
        doc["createdAt"] = now_iso
        doc["updatedAt"] = now_iso

        created = await self.repo.create(doc)
        return format_attraction_doc(created)

    async def update_attraction(self, id_str: str, data: AttractionUpdate) -> AttractionResponse:
        """Full update of an existing attraction."""
        if not ObjectId.is_valid(id_str):
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        existing = await self.repo.find_by_id(id_str)
        if not existing:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        # Check duplicate name with other attractions
        dup = await self.repo.find_by_name(data.name, exclude_id=id_str)
        if dup:
            raise AppException(
                status_code=409,
                detail=f"An attraction with name '{data.name}' already exists",
                code="DUPLICATE_NAME",
            )

        now_iso = datetime.now(timezone.utc).isoformat()
        update_dict = data.model_dump()
        update_dict["updatedAt"] = now_iso

        updated = await self.repo.update(id_str, update_dict)
        if not updated:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        return format_attraction_doc(updated)

    async def patch_attraction(self, id_str: str, data: AttractionPatch) -> AttractionResponse:
        """Partial update of an existing attraction (e.g. toggle isActive)."""
        if not ObjectId.is_valid(id_str):
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        existing = await self.repo.find_by_id(id_str)
        if not existing:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        if data.name:
            dup = await self.repo.find_by_name(data.name, exclude_id=id_str)
            if dup:
                raise AppException(
                    status_code=409,
                    detail=f"An attraction with name '{data.name}' already exists",
                    code="DUPLICATE_NAME",
                )

        update_dict = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        if not update_dict:
            return format_attraction_doc(existing)

        update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()
        updated = await self.repo.update(id_str, update_dict)
        if not updated:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        return format_attraction_doc(updated)

    async def delete_attraction(self, id_str: str) -> None:
        """Delete an attraction by id."""
        if not ObjectId.is_valid(id_str):
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")

        deleted = await self.repo.delete(id_str)
        if not deleted:
            raise AppException(status_code=404, detail="Attraction not found", code="NOT_FOUND")


attraction_service = AttractionService()
