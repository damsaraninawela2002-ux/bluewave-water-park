import os
import sys
import socket
import asyncio
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

# Ensure backend directory is in sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

# Load environment variables from backend/.env
dotenv_path = os.path.join(SCRIPT_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path)

from motor.motor_asyncio import AsyncIOMotorClient
from utils.security import hash_password


async def main():
    # Read environment variables
    mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME")

    # Print database name being used before doing anything
    print(f"Target database: {db_name}")

    if db_name != "bluewave_db":
        print(f"\n[ERROR] Database name is '{db_name}'. Expected target database is 'bluewave_db'. Aborting.")
        sys.exit(1)

    if not mongo_uri:
        print("\n[ERROR] Neither MONGO_URI nor MONGO_URL is set in backend/.env. Aborting.")
        sys.exit(1)

    # Establish MongoDB connection with 5-second server selection timeout
    client = AsyncIOMotorClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000,
    )

    try:
        # Verify connection by pinging server
        print("Connecting to MongoDB Atlas...")
        await client.admin.command("ping")
        print("[OK] Connected to MongoDB Atlas successfully.")
    except Exception as err:
        print("\n" + "=" * 68)
        print("[ERROR] Failed to connect to MongoDB Atlas!")
        print("=" * 68)
        print(f"Exact error:\n  {type(err).__name__}: {err}\n")
        print("Likely fixes:")
        print("  1. Check MONGO_URI in backend/.env - ensure cluster URL and scheme are correct.")
        print("  2. Add your current IP under MongoDB Atlas -> Network Access (or allow 0.0.0.0/0).")
        print("  3. Check the database user's password; special characters must be URL-encoded.")
        print("=" * 68 + "\n")
        sys.exit(1)

    try:
        database = client[db_name]
        users_collection = database["users"]

        admin_email = "admin@bluewave.com"
        admin_password_plain = "Admin@123"

        # Case-insensitive lookup for admin user
        existing_user = await users_collection.find_one(
            {"email": {"$regex": f"^{admin_email}$", "$options": "i"}}
        )

        hashed_password = hash_password(admin_password_plain)

        if existing_user:
            # Update password and role, keeping _id and other fields intact
            await users_collection.update_one(
                {"_id": existing_user["_id"]},
                {
                    "$set": {
                        "password": hashed_password,
                        "role": "admin",
                        "email": admin_email.lower(),
                    }
                },
            )
            result_status = "Admin password reset"
        else:
            # Insert new admin document matching user schema exactly
            new_admin_doc = {
                "name": "BlueWave Admin",
                "email": admin_email.lower(),
                "password": hashed_password,
                "role": "admin",
            }
            await users_collection.insert_one(new_admin_doc)
            result_status = "Admin created"

        # Count total users without altering any other collections or documents
        total_users = await users_collection.count_documents({})

        print("\n" + "=" * 50)
        print(f"Result:         {result_status}")
        print(f"Login Email:    {admin_email}")
        print(f"Login Password: {admin_password_plain}")
        print(f"Total Users:    {total_users}")
        print("=" * 50 + "\n")

    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
