from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[schemas.ProjectOut])
def browse_and_search_projects(
    search: Optional[str] = Query(None, description="Search keyword in title, description, or technologies"),
    category: Optional[str] = Query(None, description="Filter by category (Embedded Systems, Robotics, Software, Mechanical/CAD, ML/AI, Electrical)"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Project)

    if category and category != "All":
        query = query.filter(models.Project.category == category)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Project.title.ilike(search_pattern),
                models.Project.description.ilike(search_pattern),
                models.Project.technologies.ilike(search_pattern)
            )
        )

    projects = query.order_by(models.Project.created_at.desc()).all()
    return projects

@router.get("/me", response_model=List[schemas.ProjectOut])
def get_my_projects(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Project).filter(models.Project.author_id == current_user.id).order_by(models.Project.created_at.desc()).all()

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.post("", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
def upload_project(
    project_data: schemas.ProjectCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    new_project = models.Project(
        title=project_data.title,
        description=project_data.description,
        category=project_data.category,
        technologies=project_data.technologies,
        github_link=project_data.github_link,
        demo_link=project_data.demo_link,
        author_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.put("/{project_id}", response_model=schemas.ProjectOut)
def update_project(
    project_id: int,
    project_data: schemas.ProjectUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to modify another student's project.")

    update_data = project_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete another student's project.")

    db.delete(project)
    db.commit()
    return None
