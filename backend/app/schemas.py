from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Authentication Schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=120)
    department: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=6)
    bio: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

# User Schemas
class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    department: str
    bio: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DemonstratedSkill(BaseModel):
    technology: str
    project_count: int

class UserPublicProfile(UserOut):
    projects_count: int
    demonstrated_skills: List[DemonstratedSkill]

# Project Schemas
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    category: str  # Embedded Systems, Robotics, Software, Mechanical/CAD, ML/AI, Electrical
    technologies: str  # Comma separated e.g. "C++, Arduino, ROS 2"
    github_link: Optional[str] = None
    demo_link: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[str] = None
    github_link: Optional[str] = None
    demo_link: Optional[str] = None

class ProjectOut(ProjectBase):
    id: int
    author_id: int
    author: UserOut
    created_at: datetime

    class Config:
        from_attributes = True

# Help Request Schemas
class HelpRequestCreate(BaseModel):
    project_id: int
    message: str = Field(..., min_length=5)

class HelpRequestStatusUpdate(BaseModel):
    status: str  # Accepted or Declined

class HelpRequestOut(BaseModel):
    id: int
    project_id: int
    requester_id: int
    recipient_id: int
    message: str
    status: str
    created_at: datetime
    project_title: Optional[str] = None
    requester: UserOut
    recipient: UserOut

    class Config:
        from_attributes = True

# Dashboard Stats Schema
class DashboardStats(BaseModel):
    uploaded_projects_count: int
    sent_requests_count: int
    received_requests_count: int
    pending_requests_count: int
