from pydantic import BaseModel, EmailStr, Field


# ============================================================
# AUTH SCHEMAS
# ============================================================

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# ============================================================
# COMPLAINT SCHEMAS
# ============================================================

class ComplaintResponse(BaseModel):
    id: int
    category: str
    description: str
    photo_url: str | None
    priority: str
    status: str
    created_at: str
    overdue: bool

    class Config:
        from_attributes = True


class ComplaintHistoryResponse(BaseModel):
    id: int
    old_status: str | None
    new_status: str
    changed_by: int
    note: str | None
    created_at: str


class ComplaintUpdateRequest(BaseModel):
    status: str | None = None
    priority: str | None = None
    note: str | None = None