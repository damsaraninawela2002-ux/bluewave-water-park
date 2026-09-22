import os
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv

# Ensure SRV DNS resolution works reliably on Windows networks
try:
    import dns.resolver
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ["8.8.8.8", "1.1.1.1"]
except Exception:
    pass

load_dotenv()

from database.db import (
    database,
    users_collection,
    tickets_collection,
    attractions_collection,
    bookings_collection,
    reviews_collection,
    messages_collection,
)
from utils.security import hash_password

# ==============================================================================
# DEMO DATA DEFINITIONS
# ==============================================================================

ADMIN_DATA = {
    "name": "BlueWave Admin",
    "email": "admin@bluewave.com",
    "password": "Admin@123",
    "role": "admin",
}

CUSTOMER_USERS = [
    {
        "name": "Nimal Perera",
        "email": "nimal@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Kavindi Fernando",
        "email": "kavindi@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Dinesh Jayawardena",
        "email": "dinesh@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Tharushi Silva",
        "email": "tharushi@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Ruwan Wickrama",
        "email": "ruwan@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Anoma Kulatunga",
        "email": "anoma@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Chaminda Bandara",
        "email": "chaminda@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Dilani Senanayake",
        "email": "dilani@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "Kasun Wickramasinghe",
        "email": "kasun@example.com",
        "password": "Customer@123",
        "role": "customer",
    },
]

SAMPLE_TICKETS = [
    {
        "name": "Adult Ticket",
        "price": 2500.0,
        "description": "Full-day access to all pools, slides and attractions for ages 13 and above.",
    },
    {
        "name": "Child Ticket",
        "price": 1500.0,
        "description": "Full-day access for children aged 3 to 12, includes the Kids Area.",
    },
    {
        "name": "Family Ticket",
        "price": 7000.0,
        "description": "Best value pass for 2 adults and 2 children, all-day access.",
    },
]

SAMPLE_ATTRACTIONS = [
    # Category 1: Water Slides
    {
        "name": "Twister Rush",
        "category": "Water Slides",
        "description": "High-speed enclosed corkscrew slide with 360-degree twists plunging riders into an exhilarating splash basin.",
        "image": "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Blue Lightning",
        "category": "Water Slides",
        "description": "A heart-stopping vertical speed chute delivering lightning-fast velocity and thrilling zero-gravity drops.",
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Kamikaze Drop",
        "category": "Water Slides",
        "description": "An ultra-steep near-vertical freefall waterslide designed for ultimate thrill-seekers craving pure adrenaline.",
        "image": "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=800&q=80",
    },
    # Category 2: Wave Pool
    {
        "name": "Ocean Wave Arena",
        "category": "Wave Pool",
        "description": "A colossal tropical surf basin producing rolling 4-foot oceanic crests and tidal swells every 10 minutes.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Tsunami Bay",
        "category": "Wave Pool",
        "description": "Experience the dynamic power of sweeping breakers and gentle ocean surges bordered by breezy palms.",
        "image": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Lazy River Loop",
        "category": "Wave Pool",
        "description": "A tranquil 500-meter scenic current allowing guests to float peacefully on tubes through tropical waterfalls.",
        "image": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
    },
    # Category 3: Kids Area
    {
        "name": "Splash Kingdom",
        "category": "Kids Area",
        "description": "A multi-tiered aquatic fortress complete with mini slides, interactive water sprays, and a giant tipping bucket.",
        "image": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Mini Lagoon",
        "category": "Kids Area",
        "description": "A shallow, zero-depth haven for tiny swimmers featuring soft fountains, bubbling geysers, and friendly animal slides.",
        "image": "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=800&q=80",
    },
    {
        "name": "Tiny Tots Bay",
        "category": "Kids Area",
        "description": "Safe, shaded sensory water playground designed specifically for toddlers with cushioned surfaces and gentle fountains.",
        "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    },
]

# Booking specifications: (customer_index, ticket_index, visitDate, quantity, status)
# Customers 0 to 7 have confirmed bookings. Customer 8 (Kasun) has only pending and cancelled.
BOOKING_SPECS = [
    # Customer 0 (Nimal)
    (0, 0, "2026-09-12", 2, "confirmed"),
    (0, 2, "2026-09-24", 1, "pending"),
    # Customer 1 (Kavindi)
    (1, 2, "2026-09-15", 1, "confirmed"),
    (1, 0, "2026-10-08", 2, "pending"),
    # Customer 2 (Dinesh)
    (2, 0, "2026-09-17", 2, "confirmed"),
    (2, 1, "2026-09-29", 3, "pending"),
    # Customer 3 (Tharushi)
    (3, 1, "2026-09-18", 3, "confirmed"),
    (3, 0, "2026-10-05", 2, "pending"),
    # Customer 4 (Ruwan)
    (4, 2, "2026-09-20", 1, "confirmed"),
    # Customer 5 (Anoma)
    (5, 0, "2026-09-21", 4, "confirmed"),
    # Customer 6 (Chaminda)
    (6, 1, "2026-09-22", 2, "confirmed"),
    # Customer 7 (Dilani)
    (7, 0, "2026-09-23", 2, "confirmed"),
    # Customer 8 (Kasun - NO confirmed booking)
    (8, 2, "2026-09-27", 2, "pending"),
    (8, 0, "2026-10-12", 1, "cancelled"),
]

# Sample reviews specifications: (customer_index, rating, comment, date_str)
# 8 realistic reviews: 5, 5, 4, 5, 4, 5, 3, 4 stars (average ~4.4, with one 3-star)
SAMPLE_REVIEWS = [
    (
        0,
        5,
        "Unbelievable experience! The Kamikaze Drop was the highlight of our weekend. Booking online made park entry seamless and swift.",
        "2026-09-13T10:30:00Z",
    ),
    (
        1,
        5,
        "Brought our entire family for a weekend getaway. Cleanest water park in Sri Lanka! The kids spent hours at Splash Kingdom.",
        "2026-09-16T14:15:00Z",
    ),
    (
        2,
        4,
        "Great adrenaline rush on the Twister Rush and Blue Lightning slides. Lifeguards are attentive and facilities are immaculate.",
        "2026-09-18T16:45:00Z",
    ),
    (
        3,
        5,
        "The Wave Pool feels just like being at an ocean beach! Very safe, crystal clear water, and the changing rooms are spotless.",
        "2026-09-19T11:20:00Z",
    ),
    (
        4,
        4,
        "Very well organized water park. Family Ticket was great value. Shaded lounging areas and tube rentals were readily available.",
        "2026-09-21T09:00:00Z",
    ),
    (
        5,
        5,
        "The Lazy River is the ultimate relaxation spot. Excellent hospitality from all the lifeguards and ticketing staff!",
        "2026-09-22T12:10:00Z",
    ),
    (
        6,
        3,
        "The slides and pools are top notch, but wait times for tube rentals during peak afternoon were a bit long. Otherwise great fun!",
        "2026-09-23T15:30:00Z",
    ),
    (
        7,
        4,
        "Visited with friends from university. Had an absolute blast in Tsunami Bay! Highly recommend purchasing day passes online.",
        "2026-09-24T08:45:00Z",
    ),
]

SAMPLE_MESSAGES = [
    {
        "name": "Saman Kumara",
        "email": "saman@example.com",
        "subject": "Corporate Team Outing Package Inquiry",
        "message": "Hello BlueWave Team, we are planning a company day-out for approximately 45 members in mid-October. Do you provide corporate packages with cabana reservations and lunch buffets included?",
        "status": "new",
        "createdAt": "2026-09-24T11:00:00Z",
    },
    {
        "name": "Roshani Peiris",
        "email": "roshani@example.com",
        "subject": "Locker and Lifejacket Rental Information",
        "message": "Hi, we are visiting this Saturday with two toddlers. Are lifejackets complimentary with admission, and what are the locker rental fees? Thank you!",
        "status": "read",
        "createdAt": "2026-09-23T14:20:00Z",
    },
]


# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

async def clear_collections():
    """Clear the 6 collections before seeding."""
    print("[1/7] Clearing existing collections in database...")
    await users_collection.delete_many({})
    await tickets_collection.delete_many({})
    await attractions_collection.delete_many({})
    await bookings_collection.delete_many({})
    await reviews_collection.delete_many({})
    await messages_collection.delete_many({})
    print("      - Cleared: users, tickets, attractions, bookings, reviews, messages")


async def seed_users():
    """Insert 1 admin and 9 customers with bcrypt hashed passwords."""
    print("[2/7] Seeding users with hashed passwords...")
    inserted_users = []

    # Insert Admin
    admin_doc = {
        "name": ADMIN_DATA["name"],
        "email": ADMIN_DATA["email"].lower(),
        "password": hash_password(ADMIN_DATA["password"]),
        "role": ADMIN_DATA["role"],
    }
    admin_res = await users_collection.insert_one(admin_doc)
    admin_doc["_id"] = admin_res.inserted_id
    inserted_users.append(admin_doc)

    # Insert Customers
    customer_docs = []
    for c in CUSTOMER_USERS:
        doc = {
            "name": c["name"],
            "email": c["email"].lower(),
            "password": hash_password(c["password"]),
            "role": c["role"],
        }
        customer_docs.append(doc)

    cust_res = await users_collection.insert_many(customer_docs)
    for i, _id in enumerate(cust_res.inserted_ids):
        customer_docs[i]["_id"] = _id
        inserted_users.append(customer_docs[i])

    print(f"      - Seeded {len(inserted_users)} users (1 Admin, {len(customer_docs)} Customers)")
    return inserted_users


async def seed_tickets():
    """Insert 3 standard admission ticket tiers."""
    print("[3/7] Seeding ticket packages...")
    ticket_docs = [dict(t) for t in SAMPLE_TICKETS]
    res = await tickets_collection.insert_many(ticket_docs)
    for i, _id in enumerate(res.inserted_ids):
        ticket_docs[i]["_id"] = _id

    print(f"      - Seeded {len(ticket_docs)} tickets")
    return ticket_docs


async def seed_attractions():
    """Insert 9 attractions across Water Slides, Wave Pool, and Kids Area."""
    print("[4/7] Seeding park attractions...")
    attraction_docs = [dict(a) for a in SAMPLE_ATTRACTIONS]
    res = await attractions_collection.insert_many(attraction_docs)
    for i, _id in enumerate(res.inserted_ids):
        attraction_docs[i]["_id"] = _id

    print(f"      - Seeded {len(attraction_docs)} attractions (3 per category)")
    return attraction_docs


async def seed_bookings(customers, tickets):
    """Insert 14 bookings referencing real user and ticket ObjectIds."""
    print("[5/7] Seeding customer bookings with calculated totals...")
    now_iso = datetime.now(timezone.utc).isoformat()
    booking_docs = []

    for cust_idx, ticket_idx, visit_date, qty, status in BOOKING_SPECS:
        customer = customers[cust_idx]
        ticket = tickets[ticket_idx]
        price = float(ticket["price"])
        total = round(price * qty, 2)

        doc = {
            "userId": str(customer["_id"]),
            "ticketId": str(ticket["_id"]),
            "visitDate": visit_date,
            "quantity": qty,
            "totalAmount": total,
            "status": status,
            "createdAt": now_iso,
        }
        booking_docs.append(doc)

    res = await bookings_collection.insert_many(booking_docs)
    for i, _id in enumerate(res.inserted_ids):
        booking_docs[i]["_id"] = _id

    print(f"      - Seeded {len(booking_docs)} bookings across {len(customers)} customers")
    return booking_docs


async def seed_reviews(customers):
    """Insert 8 verified reviews linked to customers with confirmed bookings."""
    print("[6/7] Seeding 8 verified customer reviews...")
    review_docs = []

    for cust_idx, rating, comment, date_str in SAMPLE_REVIEWS:
        customer = customers[cust_idx]
        doc = {
            "userId": str(customer["_id"]),
            "userName": customer["name"],
            "rating": rating,
            "comment": comment,
            "createdAt": date_str,
        }
        review_docs.append(doc)

    res = await reviews_collection.insert_many(review_docs)
    for i, _id in enumerate(res.inserted_ids):
        review_docs[i]["_id"] = _id

    print(f"      - Seeded {len(review_docs)} reviews (Average rating: 4.4)")
    return review_docs


async def seed_messages():
    """Insert sample contact inquiry messages."""
    print("[7/7] Seeding sample contact inquiries...")
    message_docs = [dict(m) for m in SAMPLE_MESSAGES]
    res = await messages_collection.insert_many(message_docs)
    for i, _id in enumerate(res.inserted_ids):
        message_docs[i]["_id"] = _id

    print(f"      - Seeded {len(message_docs)} contact messages")
    return message_docs


def print_summary(db_name: str, review_count: int, message_count: int):
    """Print formatted summary of seeded counts and demo credentials."""
    sep = "=" * 68
    print("\n" + sep)
    print("~*~ BlueWave Water Park Database Seeding Completed! ~*~")
    print(sep)
    print(f"Target Database: {db_name}")
    print("\nCollection Record Counts:")
    print("  - Users:        10 (1 Admin, 9 Customers)")
    print("  - Tickets:      3 (Adult: Rs. 2,500, Child: Rs. 1,500, Family: Rs. 7,000)")
    print("  - Attractions:  9 (3 Water Slides, 3 Wave Pool, 3 Kids Area)")
    print("  - Bookings:     14 (8 Confirmed, 4 Pending, 2 Cancelled)")
    print(f"  - Reviews:      {review_count} (8 Verified Customer Reviews)")
    print(f"  - Messages:     {message_count} (1 New, 1 Read)")
    print("\nDemo Login Credentials:")
    print("  [ADMINISTRATOR]")
    print(f"    Email:    {ADMIN_DATA['email']}")
    print(f"    Password: {ADMIN_DATA['password']}")
    print("    Role:     admin")
    print("\n  [SAMPLE CUSTOMERS]")
    print(f"    1. {CUSTOMER_USERS[0]['name']:<24} {CUSTOMER_USERS[0]['email']:<22} (Has Confirmed Booking + Review)")
    print(f"    2. {CUSTOMER_USERS[1]['name']:<24} {CUSTOMER_USERS[1]['email']:<22} (Has Confirmed Booking + Review)")
    print(f"    9. {CUSTOMER_USERS[8]['name']:<24} {CUSTOMER_USERS[8]['email']:<22} (NO Confirmed Booking - for tests)")
    print("    * All Customer Passwords: Customer@123")
    print(sep + "\n")


# ==============================================================================
# MAIN SEEDING ENTRY POINT
# ==============================================================================

async def seed_database(clear: bool = True):
    """
    Main function to clear and seed the database.
    Order: users -> tickets -> attractions -> bookings -> reviews -> messages
    """
    db_name = os.getenv("DB_NAME", "bluewave_db")

    if clear:
        print(f"Connecting to MongoDB database: '{db_name}'...")
        await clear_collections()
    else:
        existing_count = await users_collection.count_documents({})
        if existing_count > 0:
            print(f"[Startup] Database '{db_name}' already contains data ({existing_count} users). Skipping.")
            return
        print(f"[Startup] Seeding initial demo data into '{db_name}'...")

    # 1. Users
    all_users = await seed_users()
    customers_only = [u for u in all_users if u["role"] == "customer"]

    # 2. Tickets
    tickets = await seed_tickets()

    # 3. Attractions
    await seed_attractions()

    # 4. Bookings (referencing real user and ticket ObjectIds)
    await seed_bookings(customers_only, tickets)

    # 5. Reviews (referencing real customers with confirmed bookings)
    reviews = await seed_reviews(customers_only)

    # 6. Messages
    messages = await seed_messages()

    print_summary(db_name, len(reviews), len(messages))


if __name__ == "__main__":
    asyncio.run(seed_database(clear=True))
