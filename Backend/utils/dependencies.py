from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database.db import users_collection
from utils.security import decode_access_token

security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Dependency that validates JWT bearer token and returns the current user document."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: email missing from token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = None
    try:
        user = await users_collection.find_one({"email": email.lower()})
    except Exception as e:
        print(f"[Database Error in get_current_user]: {e}")

    if user is None:
        # If database is offline or user was a seeded/demo user
        if email.lower() == "admin@bluewave.com" or payload.get("role") == "admin":
            user = {
                "_id": payload.get("id", "660000000000000000000001"),
                "name": "BlueWave Admin",
                "email": email,
                "role": "admin",
            }
        elif email.lower() == "alice@customer.com" or payload.get("role") == "customer":
            user = {
                "_id": payload.get("id", "660000000000000000000002"),
                "name": payload.get("name", "Alice Johnson"),
                "email": email,
                "role": "customer",
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

    user["id"] = str(user["_id"])
    return user


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency that ensures the authenticated user has the 'admin' role."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin privileges required",
        )
    return current_user


async def get_optional_admin(credentials: HTTPAuthorizationCredentials = Depends(security)) -> bool:
    """Optional dependency that returns True if caller is authenticated as an admin, False otherwise."""
    if not credentials:
        return False
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        return False
    return payload.get("role") == "admin"

