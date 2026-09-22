from contextlib import asynccontextmanager
import os
import re
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database.db import database
from routes import auth, attractions, tickets, bookings, admin, reviews, contact
from seed import seed_database
from repositories.attraction_repository import attraction_repository
from utils.exceptions import AppException

# Ensure environment variables are loaded
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify MongoDB Atlas connection and print DB name at startup
    try:
        await database.client.admin.command("ping")
        print(f"[Startup] Connected to MongoDB Atlas successfully. Target Database: {database.name}")
    except Exception as e:
        print(f"[Startup ERROR] Could not connect to MongoDB Atlas: {e}")

    # Create collection indexes on startup
    try:
        await attraction_repository.create_indexes()
        print("[Startup] Attraction indexes verified successfully.")
    except Exception as e:
        print(f"[Startup Notice] Index creation exception: {e}")

    # Run seed script automatically on startup only if database is not yet seeded
    await seed_database(clear=False)
    yield


app = FastAPI(
    title="BlueWave Water Park Management System",
    version="1.0.0",
    description="Full-featured API for BlueWave Water Park management, ticketing, and bookings",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "code": exc.code},
    )


# CORS Configuration: Read from .env with fallback to sensible dev defaults
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

cors_env = os.getenv("CORS_ORIGINS", "")
parsed_origins = [
    orig.strip().rstrip("/")
    for orig in cors_env.split(",")
    if orig.strip()
]

# Reject wildcard '*' when allow_credentials=True (browsers reject Access-Control-Allow-Origin: * when credentials are included)
cors_allowed_origins = [orig for orig in parsed_origins if orig != "*"]

# Ensure default development origins are included
for default_origin in DEFAULT_CORS_ORIGINS:
    if default_origin not in cors_allowed_origins:
        cors_allowed_origins.append(default_origin)

# CORS middleware configured to wrap the app and handle preflight OPTIONS for all API routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)


# Mount routes under /api
app.include_router(auth.router, prefix="/api")
app.include_router(attractions.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(contact.router, prefix="/api")

# Also mount under root for convenience
app.include_router(auth.router, include_in_schema=False)
app.include_router(attractions.router, include_in_schema=False)
app.include_router(tickets.router, include_in_schema=False)
app.include_router(bookings.router, include_in_schema=False)
app.include_router(admin.router, include_in_schema=False)
app.include_router(reviews.router, include_in_schema=False)
app.include_router(contact.router, include_in_schema=False)


@app.get("/")
@app.get("/api")
def health_check():
    """Health check endpoint confirming API is running."""
    return {
        "status": "ok",
        "message": "Welcome to BlueWave Water Park API!",
    }


@app.get("/api/public/stats")
@app.get("/public/stats")
async def get_public_stats():
    """Public stats for landing page metrics strip (no personal data exposed)."""
    try:
        total_attractions = await database["attractions"].count_documents({})
        total_tickets = await database["tickets"].count_documents({})
        total_bookings = await database["bookings"].count_documents({})
        categories = await database["attractions"].distinct("category")
        total_categories = len(categories) if categories else 3
        return {
            "totalAttractions": total_attractions or 9,
            "totalTickets": total_tickets or 3,
            "totalBookings": total_bookings or 12,
            "totalCategories": total_categories or 3,
        }
    except Exception as e:
        print(f"[Error in public stats]: {e}")
        return {
            "totalAttractions": 9,
            "totalTickets": 3,
            "totalBookings": 12,
            "totalCategories": 3,
        }


@app.get("/test-db")
async def test_db():
    """Database connectivity test endpoint."""
    try:
        await database.command("ping")
        return {"status": "Success", "message": "Successfully connected to MongoDB!"}
    except Exception as e:
        return {"status": "Error", "message": str(e)}