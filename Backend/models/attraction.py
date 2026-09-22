import re
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, field_validator

AttractionCategory = Literal["SpeedBay", "SplashBay", "ChillBay"]

URL_REGEX = re.compile(
    r"^https?://"
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
    r"localhost|"
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
    r"(?::\d+)?"
    r"(?:/?|[/?]\S+)$",
    re.IGNORECASE,
)


class AttractionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=80, description="Name of attraction (2-80 chars)")
    description: str = Field(..., min_length=10, max_length=500, description="Detailed description (10-500 chars)")
    image: str = Field(..., description="Valid HTTP or HTTPS image URL")
    category: AttractionCategory = Field(..., description="Category: SpeedBay, SplashBay, or ChillBay")
    isActive: bool = Field(True, description="Whether attraction is actively published")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 2 or len(trimmed) > 80:
            raise ValueError("Name must be between 2 and 80 characters after trimming")
        return trimmed

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 10 or len(trimmed) > 500:
            raise ValueError("Description must be between 10 and 500 characters after trimming")
        return trimmed

    @field_validator("image")
    @classmethod
    def validate_image_url(cls, v: str) -> str:
        trimmed = v.strip()
        if not (trimmed.startswith("http://") or trimmed.startswith("https://")) or not URL_REGEX.match(trimmed):
            raise ValueError("Image must be a valid http or https URL")
        return trimmed


class AttractionUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=80, description="Name of attraction (2-80 chars)")
    description: str = Field(..., min_length=10, max_length=500, description="Detailed description (10-500 chars)")
    image: str = Field(..., description="Valid HTTP or HTTPS image URL")
    category: AttractionCategory = Field(..., description="Category: SpeedBay, SplashBay, or ChillBay")
    isActive: bool = Field(True, description="Whether attraction is actively published")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 2 or len(trimmed) > 80:
            raise ValueError("Name must be between 2 and 80 characters after trimming")
        return trimmed

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 10 or len(trimmed) > 500:
            raise ValueError("Description must be between 10 and 500 characters after trimming")
        return trimmed

    @field_validator("image")
    @classmethod
    def validate_image_url(cls, v: str) -> str:
        trimmed = v.strip()
        if not (trimmed.startswith("http://") or trimmed.startswith("https://")) or not URL_REGEX.match(trimmed):
            raise ValueError("Image must be a valid http or https URL")
        return trimmed


class AttractionPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=80, description="Optional updated name")
    description: Optional[str] = Field(None, min_length=10, max_length=500, description="Optional updated description")
    image: Optional[str] = Field(None, description="Optional updated image URL")
    category: Optional[AttractionCategory] = Field(None, description="Optional updated category")
    isActive: Optional[bool] = Field(None, description="Optional updated active status")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        trimmed = v.strip()
        if len(trimmed) < 2 or len(trimmed) > 80:
            raise ValueError("Name must be between 2 and 80 characters after trimming")
        return trimmed

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        trimmed = v.strip()
        if len(trimmed) < 10 or len(trimmed) > 500:
            raise ValueError("Description must be between 10 and 500 characters after trimming")
        return trimmed

    @field_validator("image")
    @classmethod
    def validate_image_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        trimmed = v.strip()
        if not (trimmed.startswith("http://") or trimmed.startswith("https://")) or not URL_REGEX.match(trimmed):
            raise ValueError("Image must be a valid http or https URL")
        return trimmed


class AttractionResponse(BaseModel):
    id: str = Field(..., description="Unique Attraction ID string")
    name: str = Field(..., description="Name of attraction")
    description: str = Field(..., description="Detailed description")
    image: str = Field(..., description="Image URL")
    category: str = Field(..., description="Category name")
    isActive: bool = Field(True, description="Whether attraction is active")
    createdAt: Optional[str] = Field(None, description="ISO timestamp of creation")
    updatedAt: Optional[str] = Field(None, description="ISO timestamp of last update")


class AttractionListResponse(BaseModel):
    items: List[AttractionResponse] = Field(..., description="Paginated attraction items")
    total: int = Field(..., description="Total items matching query")
    page: int = Field(..., description="Current page number (1-based)")
    limit: int = Field(..., description="Items per page")
    totalPages: int = Field(..., description="Total available pages")
