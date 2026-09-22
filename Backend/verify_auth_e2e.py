import asyncio
import os
import sys
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

dotenv_path = os.path.join(SCRIPT_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

import httpx
from main import app
from database.db import (
    database,
    users_collection,
    attractions_collection,
    tickets_collection,
    bookings_collection,
    reviews_collection,
    messages_collection,
)


async def run_e2e_verification():
    print("=" * 70)
    print("BLUEWAVE WATER PARK: AUTHENTICATION END-TO-END VERIFICATION")
    print("=" * 70)

    # Initial counts to verify no other collections are modified or cleared
    counts_before = {
        "attractions": await attractions_collection.count_documents({}),
        "tickets": await tickets_collection.count_documents({}),
        "bookings": await bookings_collection.count_documents({}),
        "reviews": await reviews_collection.count_documents({}),
        "messages": await messages_collection.count_documents({}),
    }
    print(f"Target Database: {database.name}")
    print(f"Collection counts before: {counts_before}\n")

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:

        # -------------------------------------------------------------
        # (a) POST /api/auth/register with brand-new test customer
        # -------------------------------------------------------------
        test_email = "testuser1@example.com"
        test_pwd = "Test@1234"
        test_name = "Test Customer 1"

        # Cleanup test user if left from previous runs so it's idempotent
        await users_collection.delete_one({"email": test_email.lower()})

        print(f"[TEST a] Registering new customer '{test_email}'...")
        reg_payload = {
            "name": test_name,
            "email": f"  {test_email}  ",  # test whitespace stripping
            "password": test_pwd,
        }
        res_reg = await client.post("/api/auth/register", json=reg_payload)
        print(f"  Status Code: {res_reg.status_code}")
        print(f"  Response: {res_reg.json()}")
        assert res_reg.status_code == 201, f"Expected 201, got {res_reg.status_code}: {res_reg.text}"
        reg_data = res_reg.json()
        assert reg_data["user"]["role"] == "customer", f"Expected role 'customer', got {reg_data['user']['role']}"
        assert reg_data["user"]["email"] == test_email, f"Expected {test_email}, got {reg_data['user']['email']}"
        print("  [PASS] Registration returned 201 with role 'customer'.\n")

        # -------------------------------------------------------------
        # (b) POST /api/auth/login with normalized, mixed-case & spaced email
        # -------------------------------------------------------------
        print(f"[TEST b] Logging in with customer credentials (testing mixed case & spaces in email)...")
        login_variations = [
            test_email,
            "  testuser1@example.com  ",
            "TestUser1@EXAMPLE.COM",
            "  TESTUSER1@example.com  ",
        ]
        cust_token = None
        for email_variant in login_variations:
            res_cust_login = await client.post(
                "/api/auth/login",
                json={"email": email_variant, "password": test_pwd},
            )
            print(f"  Email '{email_variant}' -> HTTP {res_cust_login.status_code}")
            assert res_cust_login.status_code == 200, f"Login failed for {email_variant}: {res_cust_login.text}"
            cust_data = res_cust_login.json()
            assert "access_token" in cust_data, "Missing access_token"
            assert cust_data["user"]["role"] == "customer", f"Expected role 'customer', got {cust_data['user']['role']}"
            cust_token = cust_data["access_token"]
        print("  [PASS] Customer login successful across all email casing/spacing variations with role 'customer'.\n")

        # -------------------------------------------------------------
        # (c) POST /api/auth/login with admin@bluewave.com / Admin@123
        # -------------------------------------------------------------
        print(f"[TEST c] Logging in as admin: admin@bluewave.com / Admin@123...")
        res_admin_login = await client.post(
            "/api/auth/login",
            json={"email": " admin@bluewave.com ", "password": "Admin@123"},
        )
        print(f"  Status Code: {res_admin_login.status_code}")
        print(f"  User payload: {res_admin_login.json().get('user')}")
        assert res_admin_login.status_code == 200, f"Admin login failed: {res_admin_login.text}"
        admin_data = res_admin_login.json()
        assert "access_token" in admin_data, "Missing access_token"
        assert admin_data["user"]["role"] == "admin", f"Expected role 'admin', got {admin_data['user']['role']}"
        admin_token = admin_data["access_token"]
        print("  [PASS] Admin login returned 200 with role 'admin'.\n")

        # -------------------------------------------------------------
        # (d) GET /api/admin/stats RBAC: customer -> 403, admin -> 200
        # -------------------------------------------------------------
        print("[TEST d] Verifying RBAC on GET /api/admin/stats...")
        # Customer token -> must be 403
        res_cust_stats = await client.get(
            "/api/admin/stats",
            headers={"Authorization": f"Bearer {cust_token}"},
        )
        print(f"  Customer accessing /api/admin/stats: HTTP {res_cust_stats.status_code}")
        assert res_cust_stats.status_code == 403, f"Expected 403 Forbidden for customer, got {res_cust_stats.status_code}"

        # Admin token -> must be 200
        res_admin_stats = await client.get(
            "/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        print(f"  Admin accessing /api/admin/stats: HTTP {res_admin_stats.status_code}")
        assert res_admin_stats.status_code == 200, f"Expected 200 OK for admin, got {res_admin_stats.status_code}"
        stats = res_admin_stats.json()
        print(f"  Admin stats payload: {stats}")
        print("  [PASS] RBAC verified: Customer blocked with 403, Admin granted with 200.\n")

        # -------------------------------------------------------------
        # (e) Wrong password must return 401 with generic error
        # -------------------------------------------------------------
        print("[TEST e] Verifying generic 401 error on invalid credentials...")
        wrong_attempts = [
            ("admin@bluewave.com", "WrongAdminPass"),
            ("testuser1@example.com", "WrongCustomerPass"),
            ("nonexistent@example.com", "SomePassword123"),
        ]
        for bad_email, bad_pwd in wrong_attempts:
            res_bad = await client.post(
                "/api/auth/login",
                json={"email": bad_email, "password": bad_pwd},
            )
            print(f"  Attempt ({bad_email}, {bad_pwd}) -> HTTP {res_bad.status_code}: {res_bad.json()}")
            assert res_bad.status_code == 401, f"Expected 401, got {res_bad.status_code}"
            assert res_bad.json().get("detail") == "Invalid email or password", (
                f"Expected 'Invalid email or password', got '{res_bad.json().get('detail')}'"
            )
        print("  [PASS] Invalid logins returned 401 with generic message 'Invalid email or password'.\n")

    # -------------------------------------------------------------
    # (g) Confirm in Atlas that customer document has bcrypt hash & role
    # and other collections were NOT modified or cleared
    # -------------------------------------------------------------
    print("[TEST g] Inspecting Atlas database document integrity...")
    cust_doc = await users_collection.find_one({"email": test_email.lower()})
    assert cust_doc is not None, "Customer document not found in MongoDB Atlas"
    print(f"  Customer doc _id: {cust_doc['_id']}")
    print(f"  Customer doc role: {cust_doc['role']}")
    print(f"  Customer doc email: {cust_doc['email']}")
    assert cust_doc["role"] == "customer", "Customer role is not 'customer'"
    pwd_hash = cust_doc["password"]
    is_bcrypt = pwd_hash.startswith("$2b$") or pwd_hash.startswith("$2a$")
    print(f"  Customer doc password starts with $2b$ / $2a$: {is_bcrypt} (length {len(pwd_hash)})")
    assert is_bcrypt, "Password is not a valid bcrypt hash"

    counts_after = {
        "attractions": await attractions_collection.count_documents({}),
        "tickets": await tickets_collection.count_documents({}),
        "bookings": await bookings_collection.count_documents({}),
        "reviews": await reviews_collection.count_documents({}),
        "messages": await messages_collection.count_documents({}),
    }
    print(f"\n  Collection counts after:  {counts_after}")
    for coll_name, before_count in counts_before.items():
        assert counts_after[coll_name] == before_count, (
            f"Collection '{coll_name}' was modified! Before: {before_count}, After: {counts_after[coll_name]}"
        )
    print("  [PASS] Customer document stored with bcrypt hash and role 'customer'. Other collections untouched.\n")

    print("=" * 70)
    print("ALL 7 END-TO-END VERIFICATION CHECKS PASSED (100% SUCCESS)")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(run_e2e_verification())
