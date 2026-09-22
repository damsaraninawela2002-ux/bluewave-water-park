import os
import sys
import asyncio
from httpx import AsyncClient, ASGITransport
from main import app

async def run_tests():
    print("=== Testing Reviews & Contact Backend Endpoints ===")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test GET /api/reviews
        r = await client.get("/api/reviews")
        assert r.status_code == 200, f"Failed GET /api/reviews: {r.text}"
        reviews = r.json()
        print(f"[PASS] GET /api/reviews returned {len(reviews)} reviews")
        assert len(reviews) == 8, f"Expected 8 seeded reviews, got {len(reviews)}"

        # 2. Test GET /api/reviews/summary
        r = await client.get("/api/reviews/summary")
        assert r.status_code == 200, f"Failed GET /api/reviews/summary: {r.text}"
        summary = r.json()
        print(f"[PASS] GET /api/reviews/summary: avg={summary['averageRating']}, total={summary['totalReviews']}, stars={summary['starCounts']}")
        assert summary["totalReviews"] == 8
        assert summary["averageRating"] > 0
        assert "5" in summary["starCounts"]

        # 3. Test Admin Login (support both admin@123 and Admin@123)
        r = await client.post("/api/auth/login", json={"email": "admin@bluewave.com", "password": "admin@123"})
        if r.status_code != 200:
            r = await client.post("/api/auth/login", json={"email": "admin@bluewave.com", "password": "Admin@123"})
        assert r.status_code == 200, f"Admin login failed: {r.text}"
        admin_token = r.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("[PASS] Admin authenticated")

        # 4. Test Customer Login (Kasun - NO confirmed booking)
        r = await client.post("/api/auth/login", json={"email": "kasun@example.com", "password": "Customer@123"})
        assert r.status_code == 200, f"Kasun login failed: {r.text}"
        kasun_token = r.json()["access_token"]
        kasun_headers = {"Authorization": f"Bearer {kasun_token}"}
        print("[PASS] Kasun authenticated")

        # 5. Kasun attempts to post review (Must be blocked with 400 because no confirmed booking)
        r = await client.post(
            "/api/reviews",
            json={"rating": 5, "comment": "Trying to review without a confirmed visit!"},
            headers=kasun_headers,
        )
        assert r.status_code == 400, f"Expected 400 for user without confirmed booking, got {r.status_code}: {r.text}"
        print(f"[PASS] Blocked unconfirmed user review attempt (400): {r.json()['detail']}")

        # 6. Customer Login (Nimal - ALREADY has a seeded review)
        r = await client.post("/api/auth/login", json={"email": "nimal@example.com", "password": "Customer@123"})
        assert r.status_code == 200, f"Nimal login failed: {r.text}"
        nimal_token = r.json()["access_token"]
        nimal_headers = {"Authorization": f"Bearer {nimal_token}"}

        # 7. Nimal attempts duplicate review (Must be blocked with 409 Conflict)
        r = await client.post(
            "/api/reviews",
            json={"rating": 5, "comment": "Trying to submit a second review for the same park!"},
            headers=nimal_headers,
        )
        assert r.status_code == 409, f"Expected 409 Conflict for duplicate review, got {r.status_code}: {r.text}"
        print(f"[PASS] Blocked duplicate user review attempt (409): {r.json()['detail']}")

        # 8. Test Contact Form Submission (POST /api/contact)
        contact_data = {
            "name": "Kamal Gunaratne",
            "email": "kamal@example.com",
            "subject": "Inquiry about weekend locker availability",
            "message": "Hello, are private family lockers available for advance reservation online? Thanks!",
        }
        r = await client.post("/api/contact", json=contact_data)
        assert r.status_code == 201, f"Failed POST /api/contact: {r.text}"
        contact_msg = r.json()
        contact_id = contact_msg["id"]
        print(f"[PASS] POST /api/contact created message: id={contact_id}, status={contact_msg['status']}")

        # 9. Test Admin GET /api/contact
        r = await client.get("/api/contact", headers=admin_headers)
        assert r.status_code == 200, f"Failed Admin GET /api/contact: {r.text}"
        messages = r.json()
        print(f"[PASS] Admin GET /api/contact returned {len(messages)} messages")
        assert any(m["id"] == contact_id for m in messages)

        # 10. Test Admin GET /api/contact/unread-count
        r = await client.get("/api/contact/unread-count", headers=admin_headers)
        assert r.status_code == 200
        unread = r.json()["unreadCount"]
        print(f"[PASS] Admin unreadCount={unread}")
        assert unread >= 1

        # 11. Test Admin PATCH /api/contact/{id}/read
        r = await client.patch(f"/api/contact/{contact_id}/read", headers=admin_headers)
        assert r.status_code == 200, f"Failed marking message as read: {r.text}"
        assert r.json()["status"] == "read"
        print(f"[PASS] Message {contact_id} marked as read")

        # 12. Test Admin DELETE /api/contact/{id}
        r = await client.delete(f"/api/contact/{contact_id}", headers=admin_headers)
        assert r.status_code == 200, f"Failed deleting contact message: {r.text}"
        print(f"[PASS] Message {contact_id} deleted by Admin")

        # 13. Test Admin Stats (GET /api/admin/stats)
        r = await client.get("/api/admin/stats", headers=admin_headers)
        assert r.status_code == 200, f"Failed Admin stats: {r.text}"
        stats = r.json()
        print(f"[PASS] Admin stats: {stats}")
        assert "totalReviews" in stats
        assert "averageRating" in stats
        assert "unreadMessages" in stats
        assert stats["totalReviews"] >= 8

        # 14. Test End-to-End: Register new user -> Book ticket -> Confirm booking -> Post Review -> Succeeds!
        import time
        unique_email = f"chathura_{int(time.time())}@example.com"
        reg_data = {
            "name": "Chathura Silva",
            "email": unique_email,
            "password": "Customer@123",
        }
        r = await client.post("/api/auth/register", json=reg_data)
        assert r.status_code == 201, f"Registration failed: {r.text}"
        print("[PASS] Registered new customer Chathura")

        # Login to get JWT
        r = await client.post("/api/auth/login", json={"email": unique_email, "password": "Customer@123"})
        assert r.status_code == 200, f"Login failed: {r.text}"
        chathura_token = r.json()["access_token"]
        chathura_headers = {"Authorization": f"Bearer {chathura_token}"}
        print("[PASS] Chathura authenticated with JWT")

        # Get first ticket
        r = await client.get("/api/tickets")
        tickets = r.json()
        ticket_id = tickets[0]["id"]

        # Chathura books a ticket
        booking_data = {
            "ticketId": ticket_id,
            "visitDate": "2026-10-15",
            "quantity": 2,
        }
        r = await client.post("/api/bookings", json=booking_data, headers=chathura_headers)
        assert r.status_code == 201, f"Booking creation failed: {r.text}"
        booking_id = r.json()["id"]
        print(f"[PASS] Chathura created booking: id={booking_id}, status={r.json()['status']}")

        # Before confirmation: review attempt must fail
        r = await client.post(
            "/api/reviews",
            json={"rating": 5, "comment": "Reviewing before booking confirmed!"},
            headers=chathura_headers,
        )
        assert r.status_code == 400, f"Expected 400 before confirmation, got {r.status_code}"
        print(f"[PASS] Chathura review blocked before booking confirmed (400)")

        # Admin confirms booking
        r = await client.patch(
            f"/api/bookings/{booking_id}/status",
            json={"status": "confirmed"},
            headers=admin_headers,
        )
        assert r.status_code == 200, f"Admin confirm booking failed: {r.text}"
        print(f"[PASS] Admin confirmed Chathura's booking {booking_id}")

        # Now Chathura posts review: must SUCCEED!
        review_data = {
            "rating": 5,
            "comment": "Outstanding day at BlueWave! The slides and wave pools exceeded all expectations. Booking online was effortless!",
        }
        r = await client.post("/api/reviews", json=review_data, headers=chathura_headers)
        assert r.status_code == 201, f"Review submission failed: {r.text}"
        chathura_review_id = r.json()["id"]
        print(f"[PASS] Chathura posted review successfully! id={chathura_review_id}")

        # Test customer deleting their own review
        r = await client.delete(f"/api/reviews/{chathura_review_id}", headers=chathura_headers)
        assert r.status_code == 200, f"Customer deleting own review failed: {r.text}"
        print(f"[PASS] Chathura deleted their own review successfully")

        print("\n>>> ALL REVIEWS & CONTACT BACKEND TESTS PASSED SUCCESSFULLY! <<<\n")

if __name__ == "__main__":
    asyncio.run(run_tests())
