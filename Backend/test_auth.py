import os
import sys
import unittest
import asyncio
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from seed import seed_default_admin
from dependencies import require_admin
from fastapi import Depends


# In-memory mock for MongoDB collections to allow deterministic local testing
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
        docs = [dict(d) for d in self.docs]

        class AsyncIterator:
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

        return AsyncIterator(docs)

    async def insert_many(self, docs):
        for doc in docs:
            await self.insert_one(doc)

    async def count_documents(self, query=None):
        return len(self.docs)

    async def insert_one(self, doc):
        doc = dict(doc)
        doc["_id"] = f"mock_oid_{len(self.docs) + 1}"
        self.docs.append(doc)

        class InsertResult:
            inserted_id = doc["_id"]

        return InsertResult()


class TestBlueWaveWaterPark(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create a test admin-only route on app for dependency verification
        @app.get("/test-admin-only")
        async def admin_only_endpoint(admin=Depends(require_admin)):
            return {"status": "authorized", "admin": admin["email"]}

    def setUp(self):
        self.mock_users = MockMongoCollection()
        self.mock_attractions = MockMongoCollection()
        self.mock_tickets = MockMongoCollection()
        self.mock_bookings = MockMongoCollection()

        # Patch database collections with mocks across modules
        self.patchers = [
            patch("database.db.users_collection", self.mock_users),
            patch("database.db.attractions_collection", self.mock_attractions),
            patch("database.db.tickets_collection", self.mock_tickets),
            patch("database.db.bookings_collection", self.mock_bookings),
            patch("database.database.database.users", self.mock_users),
            patch("routes.auth.users_collection", self.mock_users),
            patch("routes.attractions.attractions_collection", self.mock_attractions),
            patch("routes.tickets.tickets_collection", self.mock_tickets),
            patch("routes.bookings.bookings_collection", self.mock_bookings),
            patch("routes.bookings.tickets_collection", self.mock_tickets),
            patch("routes.bookings.users_collection", self.mock_users),
            patch("utils.dependencies.users_collection", self.mock_users),
            patch("seed.users_collection", self.mock_users),
            patch("seed.tickets_collection", self.mock_tickets),
            patch("seed.attractions_collection", self.mock_attractions),
        ]
        for p in self.patchers:
            p.start()

        self.client = TestClient(app, raise_server_exceptions=False)

    def tearDown(self):
        for p in self.patchers:
            p.stop()

    # --- Part 1 Tests ---

    def test_health_check(self):
        """Test GET / health check endpoint."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("message", data)

    def test_all_four_routers_registered(self):
        """Confirm all 4 routers (auth, attractions, tickets, bookings) are registered."""
        # /auth/me returns 401 when unauthenticated
        auth_resp = self.client.get("/auth/me")
        self.assertEqual(auth_resp.status_code, 401)

        # /attractions/ returns 200
        attr_resp = self.client.get("/attractions/")
        self.assertEqual(attr_resp.status_code, 200)

        # /tickets/ returns 200
        tick_resp = self.client.get("/tickets/")
        self.assertEqual(tick_resp.status_code, 200)

        # /bookings/ returns 401 when unauthenticated or 200 when authenticated
        book_resp = self.client.get("/bookings/")
        self.assertIn(book_resp.status_code, [200, 401])

    # --- Part 2 Tests: Hashing & Tokens ---

    def test_password_hashing(self):
        """Test password hashing and verification using bcrypt."""
        password = "SecurePassword123!"
        hashed = hash_password(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

    def test_jwt_token_generation_and_decode(self):
        """Test JWT token encoding and decoding."""
        data = {"sub": "testuser@example.com", "role": "customer"}
        token = create_access_token(data)
        self.assertIsInstance(token, str)

        payload = decode_access_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], "testuser@example.com")
        self.assertEqual(payload["role"], "customer")

    def test_jwt_invalid_token(self):
        """Test decode returns None on corrupted token."""
        self.assertIsNone(decode_access_token("invalid.token.string"))

    # --- Part 2 Tests: Register Endpoint ---

    def test_register_customer_success(self):
        """Test POST /auth/register succeeds and assigns role 'customer'."""
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "Password@123",
        }
        response = self.client.post("/auth/register", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["status"], "Success")
        self.assertEqual(data["user"]["email"], "jane@example.com")
        self.assertEqual(data["user"]["role"], "customer")
        self.assertIn("id", data["user"])

        # Check in DB that password was hashed
        saved = self.mock_users.docs[0]
        self.assertNotEqual(saved["password"], "Password@123")
        self.assertTrue(verify_password("Password@123", saved["password"]))

    def test_register_duplicate_email_fails(self):
        """Test POST /auth/register rejects duplicate email with 400."""
        payload = {
            "name": "Jane Doe",
            "email": "duplicate@example.com",
            "password": "Password@123",
        }
        resp1 = self.client.post("/auth/register", json=payload)
        self.assertEqual(resp1.status_code, 201)

        # Second registration with same email
        resp2 = self.client.post("/auth/register", json=payload)
        self.assertEqual(resp2.status_code, 400)
        self.assertIn("already registered", resp2.json()["detail"])

    # --- Part 2 Tests: Login Endpoint ---

    def test_login_success(self):
        """Test POST /auth/login returns JWT token and user info."""
        # Register user first
        self.client.post(
            "/auth/register",
            json={"name": "Alice", "email": "alice@example.com", "password": "AlicePassword123"},
        )

        # Login
        response = self.client.post(
            "/auth/login",
            json={"email": "alice@example.com", "password": "AlicePassword123"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["user"]["email"], "alice@example.com")
        self.assertEqual(data["user"]["role"], "customer")

    def test_login_invalid_password_fails(self):
        """Test POST /auth/login with wrong password returns 401."""
        self.client.post(
            "/auth/register",
            json={"name": "Bob", "email": "bob@example.com", "password": "BobPassword123"},
        )

        response = self.client.post(
            "/auth/login",
            json={"email": "bob@example.com", "password": "WrongPassword"},
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid email or password", response.json()["detail"])

    def test_login_nonexistent_user_fails(self):
        """Test POST /auth/login with unregistered email returns 401."""
        response = self.client.post(
            "/auth/login",
            json={"email": "ghost@example.com", "password": "AnyPassword"},
        )
        self.assertEqual(response.status_code, 401)

    # --- Part 2 Tests: GET /auth/me Endpoint ---

    def test_get_me_authenticated(self):
        """Test GET /auth/me with valid Bearer token returns current user."""
        self.client.post(
            "/auth/register",
            json={"name": "Charlie", "email": "charlie@example.com", "password": "Password123"},
        )
        login_res = self.client.post(
            "/auth/login",
            json={"email": "charlie@example.com", "password": "Password123"},
        )
        token = login_res.json()["access_token"]

        response = self.client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["email"], "charlie@example.com")
        self.assertEqual(data["name"], "Charlie")
        self.assertEqual(data["role"], "customer")

    def test_get_me_missing_token_fails(self):
        """Test GET /auth/me without token returns 401."""
        response = self.client.get("/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_get_me_invalid_token_fails(self):
        """Test GET /auth/me with corrupted token returns 401."""
        response = self.client.get("/auth/me", headers={"Authorization": "Bearer badtoken123"})
        self.assertEqual(response.status_code, 401)

    # --- Part 2 Tests: require_admin & Seed Default Admin ---

    def test_require_admin_dependency(self):
        """Test that require_admin allows admin role but returns 403 for customer."""
        # 1. Customer token
        self.client.post(
            "/auth/register",
            json={"name": "Customer User", "email": "cust@example.com", "password": "Password123"},
        )
        cust_login = self.client.post(
            "/auth/login",
            json={"email": "cust@example.com", "password": "Password123"},
        )
        cust_token = cust_login.json()["access_token"]

        # Customer attempts to access admin-only endpoint -> 403
        resp_cust = self.client.get("/test-admin-only", headers={"Authorization": f"Bearer {cust_token}"})
        self.assertEqual(resp_cust.status_code, 403)
        self.assertIn("Admin privileges required", resp_cust.json()["detail"])

        # 2. Seed admin account
        asyncio.run(seed_default_admin())

        # Admin logs in
        admin_login = self.client.post(
            "/auth/login",
            json={"email": "admin@bluewave.com", "password": "Admin@123"},
        )
        self.assertEqual(admin_login.status_code, 200)
        admin_token = admin_login.json()["access_token"]

        # Admin accesses admin-only endpoint -> 200
        resp_admin = self.client.get("/test-admin-only", headers={"Authorization": f"Bearer {admin_token}"})
        self.assertEqual(resp_admin.status_code, 200)
        self.assertEqual(resp_admin.json()["admin"], "admin@bluewave.com")

    def test_seed_admin_idempotency(self):
        """Test seed_default_admin creates admin once and does not duplicate."""
        asyncio.run(seed_default_admin())
        self.assertEqual(len(self.mock_users.docs), 1)
        self.assertEqual(self.mock_users.docs[0]["email"], "admin@bluewave.com")
        self.assertEqual(self.mock_users.docs[0]["role"], "admin")

        # Run seed a second time
        asyncio.run(seed_default_admin())
        self.assertEqual(len(self.mock_users.docs), 1)


if __name__ == "__main__":
    unittest.main()
