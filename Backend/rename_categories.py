import os
import sys
import socket
import asyncio
from dotenv import load_dotenv

# Reconfigure stdout/stderr for UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    try:
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

# Ensure backend directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Load environment variables from backend/.env
dotenv_path = os.path.join(SCRIPT_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

from motor.motor_asyncio import AsyncIOMotorClient

CATEGORY_MAPPING = {
    "Water Slides": "SpeedBay",
    "Wave Pool": "SplashBay",
    "Kids Area": "ChillBay",
}


async def main():
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
        attractions_col = db["attractions"]

        # Check existing categories
        existing_distinct = await attractions_col.distinct("category")
        print(f"Categories before update: {existing_distinct}")

        total_updated = 0
        for old_cat, new_cat in CATEGORY_MAPPING.items():
            result = await attractions_col.update_many(
                {"category": old_cat},
                {"$set": {"category": new_cat}}
            )
            print(f"Mapped '{old_cat}' -> '{new_cat}': {result.modified_count} documents updated (matched: {result.matched_count})")
            total_updated += result.modified_count

        # Check distinct categories after update
        updated_distinct = await attractions_col.distinct("category")
        print(f"\nTotal documents updated: {total_updated}")
        print(f"Categories after update: {updated_distinct}")

        # List all attractions with their updated category
        cursor = attractions_col.find({}, {"name": 1, "category": 1})
        docs = await cursor.to_list(length=100)
        print("\nCurrent attractions in database:")
        for doc in docs:
            print(f" - {doc.get('name')}: {doc.get('category')} (id: {doc.get('_id')})")

    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
