from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    department: Optional[str] = "Electrical & Computer Engineering"
    bio: Optional[str] = None
    demonstrated_skills: Optional[str] = "C++, Python, Arduino, Circuit Design"

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    demonstrated_skills: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    department: str
    bio: Optional[str] = None
    demonstrated_skills: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = "Embedded Systems"
    tech_stack: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    tech_stack: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    user_id: int
    created_at: datetime
    owner: UserOut

    class Config:
        from_attributes = True

# Help Request Schemas
class HelpRequestCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = "Circuit Design"
    project_id: Optional[int] = None

class HelpRequestOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    project_id: Optional[int] = None
    user_id: int
    helper_id: Optional[int] = None
    created_at: datetime
    author: UserOut
    helper: Optional[UserOut] = None

    class Config:
        from_attributes = True
