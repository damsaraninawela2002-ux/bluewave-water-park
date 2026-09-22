from fastapi import HTTPException

class AppException(HTTPException):
    """Application-level exception with a standardized error code."""
    def __init__(self, status_code: int, detail: str, code: str = "ERROR"):
        super().__init__(status_code=status_code, detail=detail)
        self.code = code
