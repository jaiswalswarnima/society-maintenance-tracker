from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(20),
        default="resident",
        nullable=False,
    )

    complaints = relationship(
        "Complaint",
        back_populates="resident",
    )


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    resident_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    photo_url = Column(
        String(500),
        nullable=True,
    )

    priority = Column(
        String(20),
        default="Low",
        nullable=False,
    )

    status = Column(
        String(30),
        default="Open",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    resident = relationship(
        "User",
        back_populates="complaints",
    )

    history = relationship(
        "ComplaintStatusHistory",
        back_populates="complaint",
        cascade="all, delete-orphan",
        order_by="ComplaintStatusHistory.created_at",
    )


class ComplaintStatusHistory(Base):
    __tablename__ = "complaint_status_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id"),
        nullable=False,
    )

    old_status = Column(
        String(30),
        nullable=True,
    )

    new_status = Column(
        String(30),
        nullable=False,
    )

    changed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    note = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    complaint = relationship(
        "Complaint",
        back_populates="history",
    )


class Notice(Base):
    __tablename__ = "notices"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    important = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )