import os
import socket
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

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

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# MongoDB connection settings
MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DB_NAME", "bluewave_db")

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=15000,
    readPreference="primaryPreferred",
)
database = client[DATABASE_NAME]

# Collections helper references
users_collection = database["users"]
attractions_collection = database["attractions"]
tickets_collection = database["tickets"]
bookings_collection = database["bookings"]
reviews_collection = database["reviews"]
messages_collection = database["messages"]


def get_db():
    """Return database instance."""
    return database
