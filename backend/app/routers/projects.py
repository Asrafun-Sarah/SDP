from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Project, User
from ..schemas import ProjectCreate, ProjectOut
from ..auth import require_current_user

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
def list_projects(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Project)
    if category and category != "All":
        query = query.filter(Project.category == category)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            Project.title.ilike(search_pattern) |
            Project.description.ilike(search_pattern) |
            Project.tech_stack.ilike(search_pattern)
        )
    return query.order_by(Project.created_at.desc()).all()

@router.get("/my-projects", response_model=List[ProjectOut])
def get_my_projects(current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.user_id == current_user.id).order_by(Project.created_at.desc()).all()

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(project_data: ProjectCreate, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    new_proj = Project(
        title=project_data.title,
        description=project_data.description,
        category=project_data.category or "Embedded Systems",
        tech_stack=project_data.tech_stack,
        github_url=project_data.github_url,
        demo_url=project_data.demo_url,
        user_id=current_user.id
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    return new_proj

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    if proj.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this project")
    db.delete(proj)
    db.commit()
    return None
