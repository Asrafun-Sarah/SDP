import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    projects = relationship("Project", back_populates="author", cascade="all, delete-orphan")
    sent_help_requests = relationship("HelpRequest", foreign_keys="HelpRequest.requester_id", back_populates="requester")
    received_help_requests = relationship("HelpRequest", foreign_keys="HelpRequest.recipient_id", back_populates="recipient")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)  # Embedded Systems, Robotics, Software, Mechanical/CAD, ML/AI
    technologies = Column(String(300), nullable=False)  # Comma separated e.g. "C++, Arduino, ROS 2"
    github_link = Column(String(255), nullable=True)
    demo_link = Column(String(255), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    author = relationship("User", back_populates="projects")
    help_requests = relationship("HelpRequest", back_populates="project", cascade="all, delete-orphan")


class HelpRequest(Base):
    __tablename__ = "help_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="Pending", nullable=False)  # Pending, Accepted, Declined
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="help_requests")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_help_requests")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_help_requests")
