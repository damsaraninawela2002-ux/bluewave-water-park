from typing import List, Optional, Tuple
from bson import ObjectId
from pymongo.collation import Collation
from database.db import attractions_collection


class AttractionRepository:
    def __init__(self, collection=None):
        self._collection = collection

    @property
    def collection(self):
        return self._collection if self._collection is not None else attractions_collection

    async def create_indexes(self):
        """Create necessary indexes on attractions collection, including case-insensitive uniqueness on name."""
        try:
            await self.collection.create_index("category")
        except Exception as e:
            print(f"[Index Warning - category]: {e}")

        try:
            await self.collection.create_index("createdAt")
        except Exception as e:
            print(f"[Index Warning - createdAt]: {e}")

        try:
            await self.collection.create_index(
                [("name", 1)],
                unique=True,
                collation=Collation(locale="en", strength=2),
                name="uniq_name_case_insensitive",
            )
        except Exception as e:
            # If duplicate names already exist in database or index exists, log warning
            print(f"[Index Notice - name unique]: {e}")

    async def find_by_id(self, id_str: str) -> Optional[dict]:
        """Find attraction by its ObjectId string."""
        if not ObjectId.is_valid(id_str):
            return None
        return await self.collection.find_one({"_id": ObjectId(id_str)})

    async def find_by_name(self, name: str, exclude_id: Optional[str] = None) -> Optional[dict]:
        """Case-insensitively find attraction by name using English strength=2 collation."""
        query = {"name": name.strip()}
        if exclude_id and ObjectId.is_valid(exclude_id):
            query["_id"] = {"$ne": ObjectId(exclude_id)}

        try:
            return await self.collection.find_one(
                query,
                collation=Collation(locale="en", strength=2),
            )
        except Exception:
            # Fallback regex if collation is not supported by backend mongo driver version
            import re
            query["name"] = {"$regex": f"^{re.escape(name.strip())}$", "$options": "i"}
            return await self.collection.find_one(query)

    async def count(self, filter_query: dict) -> int:
        """Count documents matching filter."""
        return await self.collection.count_documents(filter_query)

    async def find_all(
        self,
        filter_query: dict,
        sort_field: str = "-createdAt",
        skip: int = 0,
        limit: Optional[int] = None,
    ) -> List[dict]:
        """Find attractions matching query with sorting and optional pagination."""
        # Parse sort field
        direction = 1
        field = sort_field or "-createdAt"
        if field.startswith("-"):
            direction = -1
            field = field[1:]

        sort_tuples = [(field, direction)]
        # Secondary sort by _id for consistency
        if field != "_id":
            sort_tuples.append(("_id", -1))

        cursor = self.collection.find(filter_query).sort(sort_tuples)
        if skip > 0:
            cursor = cursor.skip(skip)
        if limit is not None and limit > 0:
            cursor = cursor.limit(limit)

        results = []
        async for doc in cursor:
            results.append(doc)
        return results

    async def create(self, doc: dict) -> dict:
        """Insert new attraction document."""
        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def update(self, id_str: str, update_doc: dict) -> Optional[dict]:
        """Update existing attraction document and return the updated version."""
        if not ObjectId.is_valid(id_str):
            return None

        return await self.collection.find_one_and_update(
            {"_id": ObjectId(id_str)},
            {"$set": update_doc},
            return_document=True,
        )

    async def delete(self, id_str: str) -> bool:
        """Delete attraction by id. Returns True if deleted, False otherwise."""
        if not ObjectId.is_valid(id_str):
            return False

        res = await self.collection.delete_one({"_id": ObjectId(id_str)})
        return res.deleted_count > 0


attraction_repository = AttractionRepository()
