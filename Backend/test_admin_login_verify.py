import asyncio
import os
import sys
from dotenv import load_dotenv

# Reconfigure stdout for UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure backend root is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

dotenv_path = os.path.join(SCRIPT_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

import httpx
from main import app
from database.db import (
    users_collection,
    attractions_collection,
    tickets_collection,
    bookings_collection,
    reviews_collection,
    messages_collection,
)


async def main():
    print("=" * 68)
    print("VERIFYING ADMIN AUTHENTICATION AND COLLECTION INTEGRITY")
    print("=" * 68)

    # 1. Check collection counts
    user_count = await users_collection.count_documents({})
    attraction_count = await attractions_collection.count_documents({})
    ticket_count = await tickets_collection.count_documents({})
    booking_count = await bookings_collection.count_documents({})
    review_count = await reviews_collection.count_documents({})
    message_count = await messages_collection.count_documents({})

    print("\nCurrent Database Counts:")
    print(f"  - Users:        {user_count}")
    print(f"  - Attractions:  {attraction_count}")
    print(f"  - Tickets:      {ticket_count}")
    print(f"  - Bookings:     {booking_count}")
    print(f"  - Reviews:      {review_count}")
    print(f"  - Messages:     {message_count}")

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 2. Call POST /api/auth/login with admin@bluewave.com and admin@123
        print("\n[Step 1] Calling POST /api/auth/login with admin@bluewave.com / admin@123...")
        login_res = await client.post(
            "/api/auth/login",
            json={"email": "admin@bluewave.com", "password": "admin@123"},
        )
        print(f"  HTTP Status: {login_res.status_code}")
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        login_data = login_res.json()

        token = login_data.get("access_token")
        user_role = login_data.get("user", {}).get("role")
        user_email = login_data.get("user", {}).get("email")

        print(f"  Access Token (JWT): {token[:20]}...{token[-10:]}")
        print(f"  User Role:          {user_role}")
        print(f"  User Email:         {user_email}")

        assert token, "Missing access_token in response"
        assert user_role == "admin", f"Expected role 'admin', got '{user_role}'"
        assert user_email == "admin@bluewave.com", f"Expected email 'admin@bluewave.com', got '{user_email}'"
        print("  ✓ Login verified: Returned valid JWT and role 'admin'.")

        # 3. Call GET /api/admin/stats with the admin Bearer token
        print("\n[Step 2] Calling GET /api/admin/stats with Bearer token...")
        headers = {"Authorization": f"Bearer {token}"}
        stats_res = await client.get("/api/admin/stats", headers=headers)
        print(f"  HTTP Status: {stats_res.status_code}")
        assert stats_res.status_code == 200, f"Failed to get admin stats: {stats_res.text}"
        stats_data = stats_res.json()

        print("  Admin Stats Data:")
        for k, v in stats_data.items():
            print(f"    - {k}: {v}")
        print("  ✓ Admin stats endpoint verified successfully.")

    # 4. Verify counts of collections did not change
    assert (await users_collection.count_documents({})) == user_count
    assert (await attractions_collection.count_documents({})) == attraction_count
    assert (await tickets_collection.count_documents({})) == ticket_count
    assert (await bookings_collection.count_documents({})) == booking_count
    assert (await reviews_collection.count_documents({})) == review_count
    assert (await messages_collection.count_documents({})) == message_count

    print("\n" + "=" * 68)
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY (Counts Unchanged)")
    print("=" * 68 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
