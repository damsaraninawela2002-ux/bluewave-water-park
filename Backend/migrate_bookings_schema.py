import os
import sys
import socket
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv

# Reconfigure stdout/stderr for UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure SRV & shard hostname DNS resolution works reliably on Windows networks
try:
    import dns.resolver
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ["8.8.8.8", "1.1.1.1"]

    _orig_getaddrinfo = socket.getaddrinfo
    _resolver = dns.resolver.Resolver(configure=False)
    _resolver.nameservers = ["8.8.8.8", "1.1.1.1"]

    def _safe_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        try:
            return _orig_getaddrinfo(host, port, family, type, proto, flags)
        except socket.gaierror:
            try:
                answers = _resolver.resolve(host, "A")
                if answers:
                    return _orig_getaddrinfo(answers[0].address, port, family, type, proto, flags)
            except Exception:
                pass
            raise

    socket.getaddrinfo = _safe_getaddrinfo
except Exception:
    pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

dotenv_path = os.path.join(SCRIPT_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient


async def migrate():
    mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME", "bluewave_db")

    print(f"Target database: {db_name}")
    if db_name != "bluewave_db":
        print(f"ERROR: DB_NAME is '{db_name}', expected 'bluewave_db'. Aborting.")
        sys.exit(1)

    if not mongo_uri:
        print("ERROR: MONGO_URI not found in backend/.env. Aborting.")
        sys.exit(1)

    client = AsyncIOMotorClient(mongo_uri)
    try:
        db = client[db_name]
        tickets_col = db["tickets"]
        bookings_col = db["bookings"]

        # 1. Fetch tickets to create lookup mapping
        tickets_cursor = tickets_col.find({})
        tickets_by_id = {}
        tickets_by_name = {}
        async for t in tickets_cursor:
            tid_str = str(t["_id"])
            tickets_by_id[tid_str] = t
            if t.get("name"):
                tickets_by_name[t["name"].lower().strip()] = t

        print(f"Loaded {len(tickets_by_id)} active tickets from database:")
        for tid, t in tickets_by_id.items():
            print(f"  - [{tid}] {t.get('name')}: Rs. {t.get('price')}")

        # 2. Iterate through all bookings
        cursor = bookings_col.find({})
        bookings = await cursor.to_list(length=1000)
        print(f"\nFound {len(bookings)} existing booking documents to inspect.")

        migrated_count = 0
        already_migrated_count = 0
        unconverted = []

        for doc in bookings:
            doc_id = str(doc["_id"])

            # Check if document already has target schema shape
            has_ticket_type = "ticketType" in doc and doc["ticketType"]
            has_price_per_ticket = "pricePerTicket" in doc and doc["pricePerTicket"] is not None
            has_total_price = "totalPrice" in doc and doc["totalPrice"] is not None
            has_booking_status = "bookingStatus" in doc and doc["bookingStatus"]
            is_old_shape = "ticketId" in doc or "totalAmount" in doc or "status" in doc

            if has_ticket_type and has_price_per_ticket and has_total_price and has_booking_status and not is_old_shape:
                already_migrated_count += 1
                continue

            # Look up ticket
            ticket = None
            t_id = str(doc.get("ticketId", ""))
            if t_id and t_id in tickets_by_id:
                ticket = tickets_by_id[t_id]
            elif ObjectId.is_valid(t_id) and str(ObjectId(t_id)) in tickets_by_id:
                ticket = tickets_by_id[str(ObjectId(t_id))]
            elif doc.get("ticketName"):
                name_key = doc["ticketName"].lower().strip()
                if name_key in tickets_by_name:
                    ticket = tickets_by_name[name_key]
            elif doc.get("ticketType"):
                type_key = doc["ticketType"].lower().strip()
                if type_key in tickets_by_name:
                    ticket = tickets_by_name[type_key]

            if not ticket:
                unconverted.append({
                    "id": doc_id,
                    "reason": f"Ticket not found for ticketId '{t_id}' / ticketName '{doc.get('ticketName')}'",
                    "doc": {k: v for k, v in doc.items() if k != "_id"},
                })
                continue

            # Target fields
            ticket_type = ticket.get("name")
            price_per_ticket = float(ticket.get("price", 0.0))
            quantity = int(doc.get("quantity", 1))

            if doc.get("totalPrice") is not None:
                total_price = float(doc["totalPrice"])
            elif doc.get("totalAmount") is not None:
                total_price = float(doc["totalAmount"])
            else:
                total_price = round(price_per_ticket * quantity, 2)

            booking_status = doc.get("bookingStatus") or doc.get("status") or "pending"
            created_at = doc.get("createdAt") or datetime.now(timezone.utc).isoformat()
            booking_id = doc.get("bookingId") or f"BW-2026-{doc_id[-5:].upper()}"

            # Apply atomic update
            await bookings_col.update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {
                        "userId": str(doc.get("userId", "")),
                        "ticketType": ticket_type,
                        "visitDate": str(doc.get("visitDate", "")),
                        "quantity": quantity,
                        "pricePerTicket": price_per_ticket,
                        "totalPrice": total_price,
                        "bookingStatus": booking_status,
                        "createdAt": created_at,
                        "bookingId": booking_id,
                    },
                    "$unset": {
                        "ticketId": "",
                        "totalAmount": "",
                        "status": "",
                        "ticketName": "",
                        "ticketPrice": "",
                    },
                },
            )
            migrated_count += 1
            print(f"  ✓ Migrated booking {doc_id} -> ticketType='{ticket_type}', qty={quantity}, total={total_price}, status='{booking_status}'")

        print(f"\n==========================================")
        print(f"Migration Summary:")
        print(f"  Total inspected: {len(bookings)}")
        print(f"  Successfully migrated: {migrated_count}")
        print(f"  Already in target shape: {already_migrated_count}")
        print(f"  Unconverted / errors: {len(unconverted)}")
        print(f"==========================================")

        if unconverted:
            print("\nDocuments requiring manual review:")
            for item in unconverted:
                print(f"  - ID: {item['id']} | Reason: {item['reason']}")
                print(f"    Data: {item['doc']}")
        else:
            print("All documents converted cleanly without any exceptions!")

    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(migrate())
