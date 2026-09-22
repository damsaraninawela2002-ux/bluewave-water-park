import os
import sys
import pytest
from datetime import timedelta
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from database.db import MONGO_URL
from main import app
from repositories.attraction_repository import attraction_repository
from utils.security import create_access_token

# STRICT REQUIREMENT: Isolated test database 'bluewave_test' ONLY
TEST_DB_NAME = "bluewave_test"
isolated_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=15000, readPreference="primaryPreferred")
isolated_db = isolated_client[TEST_DB_NAME]
isolated_col = isolated_db["attractions"]

# Bind attraction repository to isolated test collection
attraction_repository._collection = isolated_col


@pytest.fixture(scope="session", autouse=True)
def verify_isolated_db():
    assert TEST_DB_NAME == "bluewave_test"
    assert "bluewave_db" not in isolated_db.name
    print(f"\n[Test Setup] Running tests against isolated database: {isolated_db.name}")


@pytest.fixture(autouse=True)
async def clean_collection():
    """Clear test collection before each test and re-create indexes."""
    await isolated_col.delete_many({})
    await attraction_repository.create_indexes()
    yield
    await isolated_col.delete_many({})


@pytest.fixture
def admin_headers():
    token = create_access_token(
        data={"sub": "admin@bluewave.com", "role": "admin", "id": "660000000000000000000001"},
        expires_delta=timedelta(hours=1),
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def customer_headers():
    token = create_access_token(
        data={"sub": "customer@example.com", "role": "customer", "id": "660000000000000000000002"},
        expires_delta=timedelta(hours=1),
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac


@pytest.mark.asyncio
async def test_admin_only_protection(async_client, customer_headers):
    sample_payload = {
        "name": "Super Tornado",
        "description": "An exhilarating spiral funnel drop slide.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "category": "Water Slides",
        "isActive": True,
    }

    # 1. Unauthenticated request must be blocked with 401
    res = await async_client.post("/api/attractions", json=sample_payload)
    assert res.status_code == 401

    # 2. Customer request must be blocked with 403
    res_cust = await async_client.post("/api/attractions", json=sample_payload, headers=customer_headers)
    assert res_cust.status_code == 403

    # 3. Customer PUT must be blocked with 403
    res_put = await async_client.put("/api/attractions/66a000000000000000000001", json=sample_payload, headers=customer_headers)
    assert res_put.status_code == 403

    # 4. Customer PATCH must be blocked with 403
    res_patch = await async_client.patch("/api/attractions/66a000000000000000000001", json={"isActive": False}, headers=customer_headers)
    assert res_patch.status_code == 403

    # 5. Customer DELETE must be blocked with 403
    res_del = await async_client.delete("/api/attractions/66a000000000000000000001", headers=customer_headers)
    assert res_del.status_code == 403


@pytest.mark.asyncio
async def test_create_attraction_success(async_client, admin_headers):
    payload = {
        "name": "Kraken's Revenge",
        "description": "High-velocity dual plunge with a massive splashdown lagoon.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "category": "Water Slides",
        "isActive": True,
    }

    res = await async_client.post("/api/attractions", json=payload, headers=admin_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Kraken's Revenge"
    assert data["category"] == "Water Slides"
    assert data["isActive"] is True
    assert "id" in data
    assert "createdAt" in data


@pytest.mark.asyncio
async def test_duplicate_name_case_insensitive(async_client, admin_headers):
    payload = {
        "name": "Tsunami Lagoon",
        "description": "Massive artificial ocean swells for body surfing.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "category": "Wave Pool",
        "isActive": True,
    }

    res1 = await async_client.post("/api/attractions", json=payload, headers=admin_headers)
    assert res1.status_code == 201

    # Duplicate exact name
    res2 = await async_client.post("/api/attractions", json=payload, headers=admin_headers)
    assert res2.status_code == 409
    assert res2.json().get("code") == "DUPLICATE_NAME"

    # Duplicate case-insensitive with leading/trailing spaces
    payload_upper = dict(payload, name="  TSUNAMI LAGOON  ")
    res3 = await async_client.post("/api/attractions", json=payload_upper, headers=admin_headers)
    assert res3.status_code == 409
    assert res3.json().get("code") == "DUPLICATE_NAME"


@pytest.mark.asyncio
async def test_validation_rules(async_client, admin_headers):
    # Name too short
    res_short_name = await async_client.post(
        "/api/attractions",
        json={"name": "A", "description": "A very long description here...", "image": "https://valid.com/img.jpg", "category": "Water Slides"},
        headers=admin_headers,
    )
    assert res_short_name.status_code == 422

    # Description too short
    res_short_desc = await async_client.post(
        "/api/attractions",
        json={"name": "Valid Name", "description": "Short", "image": "https://valid.com/img.jpg", "category": "Water Slides"},
        headers=admin_headers,
    )
    assert res_short_desc.status_code == 422

    # Invalid image URL
    res_bad_img = await async_client.post(
        "/api/attractions",
        json={"name": "Valid Name", "description": "A valid long description here...", "image": "ftp://bad.com", "category": "Water Slides"},
        headers=admin_headers,
    )
    assert res_bad_img.status_code == 422


@pytest.mark.asyncio
async def test_list_unpaginated_returns_plain_array(async_client, admin_headers):
    for name in ["Slide One", "Slide Two"]:
        await async_client.post(
            "/api/attractions",
            json={"name": name, "description": "A description of the thrilling ride.", "image": "https://valid.com/img.jpg", "category": "Water Slides"},
            headers=admin_headers,
        )

    res = await async_client.get("/api/attractions")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) == 2


@pytest.mark.asyncio
async def test_list_paginated_and_filtered(async_client, admin_headers):
    items_to_seed = [
        ("Viper Slide", "Water Slides"),
        ("Wave Arena", "Wave Pool"),
        ("Toddler Cove", "Kids Area"),
    ]
    for name, cat in items_to_seed:
        await async_client.post(
            "/api/attractions",
            json={"name": name, "description": "Fun and thrilling water adventure.", "image": "https://valid.com/img.jpg", "category": cat},
            headers=admin_headers,
        )

    # 1. Pagination
    res_page = await async_client.get("/api/attractions?page=1&limit=2")
    assert res_page.status_code == 200
    pdata = res_page.json()
    assert "items" in pdata
    assert pdata["total"] == 3
    assert pdata["page"] == 1
    assert pdata["limit"] == 2
    assert pdata["totalPages"] == 2
    assert len(pdata["items"]) == 2

    # 2. Category filter
    res_cat = await async_client.get("/api/attractions?category=Wave Pool")
    assert res_cat.status_code == 200
    cdata = res_cat.json()
    assert len(cdata) == 1
    assert cdata[0]["name"] == "Wave Arena"

    # 3. Search filter
    res_search = await async_client.get("/api/attractions?search=Toddler")
    assert res_search.status_code == 200
    sdata = res_search.json()
    assert len(sdata) == 1
    assert sdata[0]["name"] == "Toddler Cove"


@pytest.mark.asyncio
async def test_public_active_filter_and_admin_include_inactive(async_client, admin_headers):
    await async_client.post(
        "/api/attractions",
        json={"name": "Active Ride", "description": "Open every single operational day.", "image": "https://valid.com/img.jpg", "category": "Water Slides", "isActive": True},
        headers=admin_headers,
    )
    await async_client.post(
        "/api/attractions",
        json={"name": "Closed Ride", "description": "Closed for scheduled seasonal repairs.", "image": "https://valid.com/img.jpg", "category": "Water Slides", "isActive": False},
        headers=admin_headers,
    )

    # Public caller sees only active
    res_public = await async_client.get("/api/attractions")
    assert res_public.status_code == 200
    names = [x["name"] for x in res_public.json()]
    assert "Active Ride" in names
    assert "Closed Ride" not in names

    # Admin with includeInactive=True sees both
    res_admin = await async_client.get("/api/attractions?includeInactive=true", headers=admin_headers)
    assert res_admin.status_code == 200
    admin_names = [x["name"] for x in res_admin.json()]
    assert "Active Ride" in admin_names
    assert "Closed Ride" in admin_names


@pytest.mark.asyncio
async def test_update_and_patch_attraction(async_client, admin_headers):
    created_res = await async_client.post(
        "/api/attractions",
        json={"name": "Original Name", "description": "Original description here...", "image": "https://valid.com/img.jpg", "category": "Kids Area", "isActive": True},
        headers=admin_headers,
    )
    attr_id = created_res.json()["id"]

    # Full PUT Update
    put_res = await async_client.put(
        f"/api/attractions/{attr_id}",
        json={"name": "Updated Name", "description": "Updated description here...", "image": "https://valid.com/img2.jpg", "category": "Water Slides", "isActive": True},
        headers=admin_headers,
    )
    assert put_res.status_code == 200
    assert put_res.json()["name"] == "Updated Name"
    assert put_res.json()["category"] == "Water Slides"

    # Partial PATCH Update (e.g. toggle isActive)
    patch_res = await async_client.patch(
        f"/api/attractions/{attr_id}",
        json={"isActive": False},
        headers=admin_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["isActive"] is False
    assert patch_res.json()["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_attraction(async_client, admin_headers):
    created_res = await async_client.post(
        "/api/attractions",
        json={"name": "To Be Deleted", "description": "Temporary ride to be deleted.", "image": "https://valid.com/img.jpg", "category": "Water Slides"},
        headers=admin_headers,
    )
    attr_id = created_res.json()["id"]

    del_res = await async_client.delete(f"/api/attractions/{attr_id}", headers=admin_headers)
    assert del_res.status_code == 204

    # Subsequent GET returns 404
    get_res = await async_client.get(f"/api/attractions/{attr_id}")
    assert get_res.status_code == 404


@pytest.mark.asyncio
async def test_invalid_object_id_returns_404(async_client, admin_headers):
    invalid_id = "non_existent_or_bad_id_123"
    res_get = await async_client.get(f"/api/attractions/{invalid_id}")
    assert res_get.status_code == 404
    assert res_get.json().get("code") == "NOT_FOUND"

    res_put = await async_client.put(
        f"/api/attractions/{invalid_id}",
        json={"name": "Valid Name", "description": "Valid description here...", "image": "https://valid.com/img.jpg", "category": "Kids Area", "isActive": True},
        headers=admin_headers,
    )
    assert res_put.status_code == 404

    res_patch = await async_client.patch(
        f"/api/attractions/{invalid_id}",
        json={"isActive": False},
        headers=admin_headers,
    )
    assert res_patch.status_code == 404

    res_del = await async_client.delete(f"/api/attractions/{invalid_id}", headers=admin_headers)
    assert res_del.status_code == 404
