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
    department = Column(String, default="Electrical & Computer Engineering")
    bio = Column(Text, nullable=True, default="Engineering student passionate about building real-world hardware & software projects.")
    demonstrated_skills = Column(String, nullable=True, default="C++, Python, Arduino, Circuit Design, Git")
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    help_requests = relationship("HelpRequest", foreign_keys="[HelpRequest.user_id]", back_populates="author", cascade="all, delete-orphan")
    accepted_help = relationship("HelpRequest", foreign_keys="[HelpRequest.helper_id]", back_populates="helper")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, default="Embedded Systems")
    tech_stack = Column(String, nullable=False)
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    help_requests = relationship("HelpRequest", back_populates="project", cascade="all, delete-orphan")

class HelpRequest(Base):
    __tablename__ = "help_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, default="Circuit Design")
    status = Column(String, default="Pending") # Pending, Accepted, Declined, Completed
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    helper_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User", foreign_keys=[user_id], back_populates="help_requests")
    helper = relationship("User", foreign_keys=[helper_id], back_populates="accepted_help")
    project = relationship("Project", back_populates="help_requests")
