import os
import sys
import unittest
import asyncio
from datetime import date, timedelta
from unittest.mock import patch
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app


class MockMongoCollection:
    def __init__(self):
        self.docs = []

    async def find_one(self, query):
        for doc in self.docs:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, query=None):
        query = query or {}
        filtered = []
        for doc in self.docs:
            match = True
            for k, v in query.items():
                if k == "_id" and isinstance(v, dict) and "$in" in v:
                    if doc.get("_id") not in v["$in"]:
                        match = False
                        break
                elif doc.get(k) != v:
                    match = False
                    break
            if match:
                filtered.append(dict(doc))

        class AsyncIterator:
            def __init__(self, items):
                self.items = items
                self.index = 0

            def sort(self, key, direction=1):
                return self

            def __aiter__(self):
                return self

            async def __anext__(self):
                if self.index < len(self.items):
                    item = self.items[self.index]
                    self.index += 1
                    return item
                raise StopAsyncIteration

        return AsyncIterator(filtered)

    async def insert_one(self, doc):
        doc = dict(doc)
        from bson import ObjectId
        doc["_id"] = ObjectId()
        self.docs.append(doc)

        class InsertResult:
            inserted_id = doc["_id"]

        return InsertResult()

    async def insert_many(self, docs):
        from bson import ObjectId
        ids = []
        for d in docs:
            d_copy = dict(d)
            d_copy["_id"] = ObjectId()
            self.docs.append(d_copy)
            ids.append(d_copy["_id"])

        class InsertManyResult:
            inserted_ids = ids

        return InsertManyResult()

    async def find_one_and_update(self, query, update, return_document=True):
        doc = await self.find_one(query)
        if not doc:
            return None
        if "$set" in update:
            for k, v in update["$set"].items():
                doc[k] = v
        # update in docs list
        for i, d in enumerate(self.docs):
            if d["_id"] == doc["_id"]:
                self.docs[i] = doc
                break
        return dict(doc)

    async def delete_one(self, query):
        initial_len = len(self.docs)
        self.docs = [d for d in self.docs if not all(d.get(k) == v for k, v in query.items())]
        deleted_count = initial_len - len(self.docs)

        class DeleteResult:
            pass

        res = DeleteResult()
        res.deleted_count = deleted_count
        return res

    async def count_documents(self, query):
        if not query:
            return len(self.docs)
        count = 0
        for doc in self.docs:
            if all(doc.get(k) == v for k, v in query.items()):
                count += 1
        return count

    def aggregate(self, pipeline):
        results = []
        # Support basic status == confirmed totalAmount sum
        revenue = sum(
            float(d.get("totalAmount", 0))
            for d in self.docs
            if d.get("status") == "confirmed"
        )
        results = [{"_id": None, "totalRevenue": revenue}]

        class AsyncAggIterator:
            def __init__(self, items):
                self.items = items
                self.index = 0

            def __aiter__(self):
                return self

            async def __anext__(self):
                if self.index < len(self.items):
                    item = self.items[self.index]
                    self.index += 1
                    return item
                raise StopAsyncIteration

        return AsyncAggIterator(results)


class TestFullSystem(unittest.TestCase):
    def setUp(self):
        self.mock_users = MockMongoCollection()
        self.mock_attractions = MockMongoCollection()
        self.mock_tickets = MockMongoCollection()
        self.mock_bookings = MockMongoCollection()

        self.patchers = [
            patch("database.db.users_collection", self.mock_users),
            patch("database.db.attractions_collection", self.mock_attractions),
            patch("database.db.tickets_collection", self.mock_tickets),
            patch("database.db.bookings_collection", self.mock_bookings),
            patch("routes.auth.users_collection", self.mock_users),
            patch("routes.attractions.attractions_collection", self.mock_attractions),
            patch("routes.tickets.tickets_collection", self.mock_tickets),
            patch("routes.bookings.bookings_collection", self.mock_bookings),
            patch("routes.bookings.tickets_collection", self.mock_tickets),
            patch("routes.bookings.users_collection", self.mock_users),
            patch("routes.admin.users_collection", self.mock_users),
            patch("routes.admin.bookings_collection", self.mock_bookings),
            patch("utils.dependencies.users_collection", self.mock_users),
            patch("seed.users_collection", self.mock_users),
            patch("seed.tickets_collection", self.mock_tickets),
            patch("seed.attractions_collection", self.mock_attractions),
        ]

        for p in self.patchers:
            p.start()

        self.client = TestClient(app, raise_server_exceptions=False)

        # Seed data
        from seed import seed_database
        asyncio.run(seed_database())

        # Obtain Admin token
        admin_login = self.client.post(
            "/api/auth/login",
            json={"email": "admin@bluewave.com", "password": "Admin@123"},
        )
        self.admin_token = admin_login.json()["access_token"]
        self.admin_headers = {"Authorization": f"Bearer {self.admin_token}"}

        # Register and login customer
        self.client.post(
            "/api/auth/register",
            json={"name": "Alice Customer", "email": "alice@customer.com", "password": "AlicePassword123"},
        )
        cust_login = self.client.post(
            "/api/auth/login",
            json={"email": "alice@customer.com", "password": "AlicePassword123"},
        )
        self.cust_token = cust_login.json()["access_token"]
        self.cust_headers = {"Authorization": f"Bearer {self.cust_token}"}

    def tearDown(self):
        for p in self.patchers:
            p.stop()

    def test_health_check(self):
        resp = self.client.get("/api")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "ok")

    def test_public_and_admin_attractions(self):
        # 1. Public GET /api/attractions
        resp = self.client.get("/api/attractions")
        self.assertEqual(resp.status_code, 200)
        attractions = resp.json()
        self.assertGreaterEqual(len(attractions), 6)

        # 2. Filter by category
        resp_filtered = self.client.get("/api/attractions?category=Water Slides")
        self.assertEqual(resp_filtered.status_code, 200)
        for attr in resp_filtered.json():
            self.assertEqual(attr["category"], "Water Slides")

        # 3. Customer cannot create attraction (403)
        new_attr = {
            "name": "Super Slide",
            "description": "An exciting new super fast water slide.",
            "image": "https://example.com/slide.jpg",
            "category": "Water Slides",
        }
        res_cust = self.client.post("/api/attractions", json=new_attr, headers=self.cust_headers)
        self.assertEqual(res_cust.status_code, 403)

        # 4. Admin creates attraction
        res_admin = self.client.post("/api/attractions", json=new_attr, headers=self.admin_headers)
        self.assertEqual(res_admin.status_code, 201)
        created_id = res_admin.json()["id"]

        # 5. Admin updates attraction
        update_data = {"name": "Mega Slide"}
        res_up = self.client.put(f"/api/attractions/{created_id}", json=update_data, headers=self.admin_headers)
        self.assertEqual(res_up.status_code, 200)
        self.assertEqual(res_up.json()["name"], "Mega Slide")

        # 6. Admin deletes attraction
        res_del = self.client.delete(f"/api/attractions/{created_id}", headers=self.admin_headers)
        self.assertEqual(res_del.status_code, 200)

    def test_public_and_admin_tickets(self):
        # 1. Public GET /api/tickets
        resp = self.client.get("/api/tickets")
        self.assertEqual(resp.status_code, 200)
        tickets = resp.json()
        self.assertGreaterEqual(len(tickets), 3)

        # 2. Customer cannot create ticket (403)
        res_cust = self.client.post(
            "/api/tickets",
            json={"name": "VIP Pass", "price": 120.0, "description": "VIP pass"},
            headers=self.cust_headers,
        )
        self.assertEqual(res_cust.status_code, 403)

        # 3. Admin creates ticket
        res_admin = self.client.post(
            "/api/tickets",
            json={"name": "VIP Pass", "price": 120.0, "description": "All access VIP pass"},
            headers=self.admin_headers,
        )
        self.assertEqual(res_admin.status_code, 201)
        vip_id = res_admin.json()["id"]

        # 4. Admin updates ticket
        res_up = self.client.put(f"/api/tickets/{vip_id}", json={"price": 150.0}, headers=self.admin_headers)
        self.assertEqual(res_up.status_code, 200)
        self.assertEqual(res_up.json()["price"], 150.0)

        # 5. Admin deletes ticket
        res_del = self.client.delete(f"/api/tickets/{vip_id}", headers=self.admin_headers)
        self.assertEqual(res_del.status_code, 200)

    def test_bookings_flow(self):
        # Get an available ticket
        tickets = self.client.get("/api/tickets").json()
        ticket = tickets[0]
        ticket_id = ticket["id"]
        ticket_price = ticket["price"]

        # 1. Reject booking with past date
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        res_past = self.client.post(
            "/api/bookings",
            json={"ticketId": ticket_id, "visitDate": yesterday, "quantity": 2},
            headers=self.cust_headers,
        )
        self.assertEqual(res_past.status_code, 422)  # Pydantic validation error

        # 2. Reject quantity > 20
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        res_qty = self.client.post(
            "/api/bookings",
            json={"ticketId": ticket_id, "visitDate": tomorrow, "quantity": 25},
            headers=self.cust_headers,
        )
        self.assertEqual(res_qty.status_code, 422)

        # 3. Create valid booking (quantity 3)
        res_booking = self.client.post(
            "/api/bookings",
            json={"ticketId": ticket_id, "visitDate": tomorrow, "quantity": 3},
            headers=self.cust_headers,
        )
        self.assertEqual(res_booking.status_code, 201)
        booking = res_booking.json()
        expected_total = round(ticket_price * 3, 2)
        self.assertEqual(booking["totalAmount"], expected_total)
        self.assertEqual(booking["status"], "pending")
        self.assertEqual(booking["ticketName"], ticket["name"])
        booking_id = booking["id"]

        # 4. Customer views own bookings
        res_my = self.client.get("/api/bookings/my", headers=self.cust_headers)
        self.assertEqual(res_my.status_code, 200)
        my_bookings = res_my.json()
        self.assertGreaterEqual(len(my_bookings), 1)
        self.assertEqual(my_bookings[0]["ticketName"], ticket["name"])

        # 5. Admin views all bookings
        res_all = self.client.get("/api/bookings", headers=self.admin_headers)
        self.assertEqual(res_all.status_code, 200)
        all_bookings = res_all.json()
        self.assertGreaterEqual(len(all_bookings), 1)
        self.assertEqual(all_bookings[0]["userName"], "Alice Customer")

        # 6. Admin confirms booking
        res_conf = self.client.patch(
            f"/api/bookings/{booking_id}/status",
            json={"status": "confirmed"},
            headers=self.admin_headers,
        )
        self.assertEqual(res_conf.status_code, 200)
        self.assertEqual(res_conf.json()["status"], "confirmed")

        # 7. Customer cannot cancel confirmed booking
        res_cancel = self.client.patch(f"/api/bookings/{booking_id}/cancel", headers=self.cust_headers)
        self.assertEqual(res_cancel.status_code, 400)

        # 8. Create a second booking to test customer cancellation
        res_b2 = self.client.post(
            "/api/bookings",
            json={"ticketId": ticket_id, "visitDate": tomorrow, "quantity": 1},
            headers=self.cust_headers,
        )
        b2_id = res_b2.json()["id"]

        # Customer cancels pending booking -> 200
        res_cancel_ok = self.client.patch(f"/api/bookings/{b2_id}/cancel", headers=self.cust_headers)
        self.assertEqual(res_cancel_ok.status_code, 200)
        self.assertEqual(res_cancel_ok.json()["status"], "cancelled")

    def test_admin_stats(self):
        # Create a confirmed booking to verify revenue calculation
        tickets = self.client.get("/api/tickets").json()
        ticket_id = tickets[0]["id"]
        tomorrow = (date.today() + timedelta(days=2)).isoformat()

        res_b = self.client.post(
            "/api/bookings",
            json={"ticketId": ticket_id, "visitDate": tomorrow, "quantity": 2},
            headers=self.cust_headers,
        )
        b_id = res_b.json()["id"]

        # Confirm booking
        self.client.patch(
            f"/api/bookings/{b_id}/status",
            json={"status": "confirmed"},
            headers=self.admin_headers,
        )

        # Fetch stats
        res_stats = self.client.get("/api/admin/stats", headers=self.admin_headers)
        self.assertEqual(res_stats.status_code, 200)
        stats = res_stats.json()
        self.assertGreaterEqual(stats["totalCustomers"], 1)
        self.assertGreaterEqual(stats["totalBookings"], 1)
        self.assertGreater(stats["totalRevenue"], 0.0)


if __name__ == "__main__":
    unittest.main()
