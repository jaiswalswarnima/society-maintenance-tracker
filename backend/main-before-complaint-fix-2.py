import os
from datetime import date, datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    Header,
    HTTPException,
    Query,
    UploadFile,
)
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from auth import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from database import Base, engine, get_db
from models import (
    Complaint,
    ComplaintStatusHistory,
    User,
)
from schemas import (
    ComplaintHistoryResponse,
    ComplaintResponse,
    ComplaintUpdateRequest,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Society Maintenance Tracker API",
    description="Apartment society complaint and maintenance management system",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads",
)


# ============================================================
# CONFIGURATION
# ============================================================

OVERDUE_DAYS = int(
    os.getenv("OVERDUE_DAYS", "3")
)


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Society Maintenance Tracker API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# AUTHENTICATION HELPERS
# ============================================================

def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required",
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format",
        )

    token = authorization.split(" ", 1)[1]

    token_data = decode_access_token(token)

    if not token_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(
        User.id == token_data["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user


def require_admin(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )

    return current_user


def require_resident(
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "resident":
        raise HTTPException(
            status_code=403,
            detail="Resident access required",
        )

    return current_user


# ============================================================
# HELPER — OVERDUE
# ============================================================

def is_complaint_overdue(complaint: Complaint) -> bool:
    if complaint.status == "Resolved":
        return False

    deadline = complaint.created_at + timedelta(
        days=OVERDUE_DAYS
    )

    return datetime.utcnow() > deadline


# ============================================================
# REGISTER
# ============================================================

@app.post(
    "/auth/register",
    response_model=UserResponse,
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="resident",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ============================================================
# LOGIN
# ============================================================

@app.post("/auth/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


# ============================================================
# CURRENT USER
# ============================================================

@app.get(
    "/auth/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


# ============================================================
# ROLE TEST ROUTES
# ============================================================

@app.get("/resident/test")
def resident_test(
    current_user: User = Depends(get_current_user),
):
    return {
        "message": "Resident access successful",
        "user": current_user.name,
    }


@app.get("/admin/test")
def admin_test(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Admin access successful",
        "user": current_user.name,
    }


# ============================================================
# CREATE COMPLAINT
# ============================================================

@app.post("/complaints")
async def create_complaint(
    category: str = Form(...),
    description: str = Form(...),
    photo: UploadFile | None = File(default=None),
    current_user: User = Depends(require_resident),
    db: Session = Depends(get_db),
):
    if not category.strip():
        raise HTTPException(
            status_code=400,
            detail="Category is required",
        )

    if not description.strip():
        raise HTTPException(
            status_code=400,
            detail="Description is required",
        )

    photo_url = None

    # --------------------------------------------------------
    # PHOTO UPLOAD
    # --------------------------------------------------------

    if photo is not None:
        allowed_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }

        if photo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, PNG, and WEBP images are allowed",
            )

        file_extension = os.path.splitext(
            photo.filename or ""
        )[1].lower()

        filename = (
            f"complaint_{current_user.id}_"
            f"{int(datetime.utcnow().timestamp() * 1000)}"
            f"{file_extension}"
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            filename,
        )

        file_content = await photo.read()

        if len(file_content) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Photo size must be less than 5 MB",
            )

        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        photo_url = f"/uploads/{filename}"

    # --------------------------------------------------------
    # CREATE COMPLAINT
    # --------------------------------------------------------

    complaint = Complaint(
        resident_id=current_user.id,
        category=category.strip(),
        description=description.strip(),
        photo_url=photo_url,
        priority="Low",
        status="Open",
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    # --------------------------------------------------------
    # INITIAL STATUS HISTORY
    # --------------------------------------------------------

    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        old_status=None,
        new_status="Open",
        changed_by=current_user.id,
        note="Complaint created",
    )

    db.add(history)
    db.commit()

    return {
        "message": "Complaint created successfully",
        "complaint": {
            "id": complaint.id,
            "category": complaint.category,
            "description": complaint.description,
            "photo_url": complaint.photo_url,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "overdue": False,
        },
    }


# ============================================================
# RESIDENT — VIEW OWN COMPLAINTS
# ============================================================

@app.get("/complaints/my")
def get_my_complaints(
    current_user: User = Depends(require_resident),
    db: Session = Depends(get_db),
):
    complaints = (
        db.query(Complaint)
        .filter(
            Complaint.resident_id == current_user.id
        )
        .order_by(
            Complaint.created_at.desc()
        )
        .all()
    )

    result = []

    for complaint in complaints:
        result.append({
            "id": complaint.id,
            "category": complaint.category,
            "description": complaint.description,
            "photo_url": complaint.photo_url,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "overdue": is_complaint_overdue(complaint),
        })

    return result


# ============================================================
# RESIDENT — VIEW SINGLE COMPLAINT
# ============================================================

@app.get("/complaints/{complaint_id}")
def get_complaint(
    complaint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    # Resident can only see own complaint
    if (
        current_user.role == "resident"
        and complaint.resident_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="You can only view your own complaints",
        )

    history = (
        db.query(ComplaintStatusHistory)
        .filter(
            ComplaintStatusHistory.complaint_id
            == complaint.id
        )
        .order_by(
            ComplaintStatusHistory.created_at.asc()
        )
        .all()
    )

    return {
        "id": complaint.id,
        "category": complaint.category,
        "description": complaint.description,
        "photo_url": complaint.photo_url,
        "priority": complaint.priority,
        "status": complaint.status,
        "created_at": complaint.created_at,
        "overdue": is_complaint_overdue(complaint),
        "history": [
            {
                "id": item.id,
                "old_status": item.old_status,
                "new_status": item.new_status,
                "changed_by": item.changed_by,
                "note": item.note,
                "created_at": item.created_at,
            }
            for item in history
        ],
    }

# ============================================================
# ADMIN — VIEW ALL COMPLAINTS WITH FILTERS
# ============================================================

@app.get("/admin/complaints")
def get_all_complaints(
    category: str | None = Query(
        default=None
    ),
    status: str | None = Query(
        default=None
    ),
    complaint_date: date | None = Query(
        default=None
    ),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Complaint)

    # --------------------------------------------------------
    # CATEGORY FILTER
    # --------------------------------------------------------

    if category:
        query = query.filter(
            Complaint.category == category
        )

    # --------------------------------------------------------
    # STATUS FILTER
    # --------------------------------------------------------

    if status:
        query = query.filter(
            Complaint.status == status
        )

    # --------------------------------------------------------
    # DATE FILTER
    # --------------------------------------------------------

    if complaint_date:
        start_datetime = datetime.combine(
            complaint_date,
            datetime.min.time(),
        )

        end_datetime = start_datetime + timedelta(
            days=1
        )

        query = query.filter(
            Complaint.created_at >= start_datetime,
            Complaint.created_at < end_datetime,
        )

    complaints = (
        query
        .order_by(Complaint.created_at.asc())
        .all()
    )

    # --------------------------------------------------------
    # OVERDUE FIRST
    # --------------------------------------------------------

    complaints.sort(
        key=lambda complaint: (
            not is_complaint_overdue(complaint),
            -complaint.created_at.timestamp(),
        )
    )

    result = []

    for complaint in complaints:
        result.append({
            "id": complaint.id,
            "resident_id": complaint.resident_id,
            "category": complaint.category,
            "description": complaint.description,
            "photo_url": complaint.photo_url,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "overdue": is_complaint_overdue(
                complaint
            ),
        })

    return result


# ============================================================
# ADMIN — UPDATE COMPLAINT
# ============================================================

@app.patch("/admin/complaints/{complaint_id}")
def update_complaint(
    complaint_id: int,
    data: ComplaintUpdateRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    # --------------------------------------------------------
    # VALID STATUS VALUES
    # --------------------------------------------------------

    allowed_statuses = {
        "Open",
        "In Progress",
        "Resolved",
    }

    allowed_priorities = {
        "Low",
        "Medium",
        "High",
    }

    # --------------------------------------------------------
    # STATUS VALIDATION
    # --------------------------------------------------------

    if data.status is not None:

        if data.status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Status must be Open, "
                    "In Progress, or Resolved"
                ),
            )

        # Once resolved, complaint is closed
        if (
            complaint.status == "Resolved"
            and data.status != "Resolved"
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    "Resolved complaints cannot "
                    "be reopened"
                ),
            )

    # --------------------------------------------------------
    # PRIORITY VALIDATION
    # --------------------------------------------------------

    if data.priority is not None:

        if data.priority not in allowed_priorities:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Priority must be Low, "
                    "Medium, or High"
                ),
            )

    old_status = complaint.status

    status_changed = (
        data.status is not None
        and data.status != old_status
    )

    # --------------------------------------------------------
    # UPDATE PRIORITY
    # --------------------------------------------------------

    if data.priority is not None:
        complaint.priority = data.priority

    # --------------------------------------------------------
    # UPDATE STATUS
    # --------------------------------------------------------

    if data.status is not None:
        complaint.status = data.status

    db.add(complaint)

    # --------------------------------------------------------
    # RECORD STATUS HISTORY
    # --------------------------------------------------------

    if status_changed:

        history = ComplaintStatusHistory(
            complaint_id=complaint.id,
            old_status=old_status,
            new_status=data.status,
            changed_by=current_user.id,
            note=data.note,
        )

        db.add(history)

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint updated successfully",
        "complaint": {
            "id": complaint.id,
            "category": complaint.category,
            "description": complaint.description,
            "photo_url": complaint.photo_url,
            "priority": complaint.priority,
            "status": complaint.status,
            "created_at": complaint.created_at,
            "overdue": is_complaint_overdue(
                complaint
            ),
        },
        "status_changed": status_changed,
    }
    