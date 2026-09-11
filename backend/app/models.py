from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

    department = Column(
        String,
        default="Electrical & Computer Engineering"
    )

    bio = Column(
        Text,
        nullable=True,
        default="Engineering student passionate about building real-world hardware & software projects."
    )

    demonstrated_skills = Column(
        String,
        nullable=True,
        default="C++, Python, Arduino, Circuit Design, Git"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ========================================================
    # Projects uploaded by this user
    # ========================================================

    projects = relationship(
        "Project",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    # ========================================================
    # Existing project-help requests sent by this user
    # ========================================================

    help_requests = relationship(
        "HelpRequest",
        foreign_keys="[HelpRequest.user_id]",
        back_populates="author",
        cascade="all, delete-orphan"
    )

    # ========================================================
    # Existing project-help requests where this user is helper
    # ========================================================

    accepted_help = relationship(
        "HelpRequest",
        foreign_keys="[HelpRequest.helper_id]",
        back_populates="helper"
    )

    # ========================================================
    # Student-to-student requests sent by this user
    # ========================================================

    sent_student_requests = relationship(
        "StudentRequest",
        foreign_keys="[StudentRequest.sender_id]",
        back_populates="sender",
        cascade="all, delete-orphan"
    )

    # ========================================================
    # Student-to-student requests received by this user
    # ========================================================

    received_student_requests = relationship(
        "StudentRequest",
        foreign_keys="[StudentRequest.receiver_id]",
        back_populates="receiver",
        cascade="all, delete-orphan"
    )


class Project(Base):

    __tablename__ = "projects"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    category = Column(
        String,
        default="Embedded Systems"
    )

    tech_stack = Column(
        String,
        nullable=False
    )

    github_url = Column(
        String,
        nullable=True
    )

    demo_url = Column(
        String,
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    owner = relationship(
        "User",
        back_populates="projects"
    )

    help_requests = relationship(
        "HelpRequest",
        back_populates="project",
        cascade="all, delete-orphan"
    )


class HelpRequest(Base):

    __tablename__ = "help_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    category = Column(
        String,
        default="Circuit Design"
    )

    status = Column(
        String,
        default="Pending"
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    helper_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    author = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="help_requests"
    )

    helper = relationship(
        "User",
        foreign_keys=[helper_id],
        back_populates="accepted_help"
    )

    project = relationship(
        "Project",
        back_populates="help_requests"
    )


# ============================================================
# Student-to-Student Request
# ============================================================

class StudentRequest(Base):

    __tablename__ = "student_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Student who sends the request
    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Student who receives the request
    receiver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Initial message attached to the connection request
    message = Column(
        Text,
        nullable=False
    )

    # Pending, Accepted, or Declined
    status = Column(
        String,
        default="Pending",
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="sent_student_requests"
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id],
        back_populates="received_student_requests"
    )


# ============================================================
# Student-to-Student Messages
# ============================================================

class Message(Base):

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Student who sends the message
    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Student who receives the message
    receiver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Actual chat message
    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id]
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id]
    )