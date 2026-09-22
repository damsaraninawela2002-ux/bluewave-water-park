from typing import List, Optional, Union
from fastapi import APIRouter, Depends, Query, status, Response
from models.attraction import (
    AttractionCreate,
    AttractionUpdate,
    AttractionPatch,
    AttractionResponse,
    AttractionListResponse,
)
from services.attraction_service import attraction_service
from utils.dependencies import require_admin, get_optional_admin

router = APIRouter(prefix="/attractions", tags=["Attractions"])


@router.get(
    "",
    response_model=Union[AttractionListResponse, List[AttractionResponse]],
    summary="List Attractions",
    description=(
        "Retrieve park attractions. When page and limit are omitted, returns a plain array of attractions. "
        "When page or limit is provided, returns a paginated object with total and page metadata. "
        "Public requests only see active attractions unless requested by an authorized admin with includeInactive=true."
    ),
)
@router.get(
    "/",
    response_model=Union[AttractionListResponse, List[AttractionResponse]],
    include_in_schema=False,
)
async def list_attractions(
    page: Optional[int] = Query(None, ge=1, description="Page number (1-based)"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search keyword in attraction name or description"),
    category: Optional[str] = Query(None, description="Filter by category ('SpeedBay', 'SplashBay', 'ChillBay')"),
    status: Optional[str] = Query(None, description="Filter by status ('active', 'inactive', 'all')"),
    sort: Optional[str] = Query("-createdAt", description="Sort field, prefix with - for descending (e.g. -createdAt, name)"),
    includeInactive: bool = Query(False, description="Include inactive attractions (Admin only)"),
    is_admin: bool = Depends(get_optional_admin),
):
    return await attraction_service.list_attractions(
        page=page,
        limit=limit,
        search=search,
        category=category,
        status=status,
        sort=sort,
        include_inactive=includeInactive,
        is_admin=is_admin,
    )


@router.get(
    "/{id}",
    response_model=AttractionResponse,
    summary="Get Attraction By ID",
    description="Retrieve full details for a single park attraction by its unique MongoDB ObjectId.",
)
async def get_attraction(id: str):
    return await attraction_service.get_attraction(id)


@router.post(
    "",
    response_model=AttractionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Attraction",
    description="Admin only: Create a new park attraction with unique name, category, and photo URL.",
)
@router.post(
    "/",
    response_model=AttractionResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
async def create_attraction(
    attraction_in: AttractionCreate,
    admin: dict = Depends(require_admin),
):
    return await attraction_service.create_attraction(attraction_in)


@router.put(
    "/{id}",
    response_model=AttractionResponse,
    summary="Full Update Attraction",
    description="Admin only: Fully update an existing park attraction's name, category, description, and status.",
)
async def update_attraction(
    id: str,
    update_in: AttractionUpdate,
    admin: dict = Depends(require_admin),
):
    return await attraction_service.update_attraction(id, update_in)


@router.patch(
    "/{id}",
    response_model=AttractionResponse,
    summary="Partial Update Attraction",
    description="Admin only: Partially update specific attraction fields, such as toggling its active status.",
)
async def patch_attraction(
    id: str,
    patch_in: AttractionPatch,
    admin: dict = Depends(require_admin),
):
    return await attraction_service.patch_attraction(id, patch_in)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Attraction",
    description="Admin only: Permanently delete a park attraction by its ID.",
)
async def delete_attraction(
    id: str,
    admin: dict = Depends(require_admin),
):
    await attraction_service.delete_attraction(id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)