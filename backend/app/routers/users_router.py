from typing import List
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{user_id}", response_model=schemas.UserPublicProfile)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    user_projects = db.query(models.Project).filter(models.Project.author_id == user_id).all()
    
    # Feature 10: Calculate Demonstrated Experience based on student's projects
    tech_counter = Counter()
    for proj in user_projects:
        if proj.technologies:
            # Split comma separated tech strings like "C++, Arduino, ROS 2"
            techs = [tech.strip() for tech in proj.technologies.split(",") if tech.strip()]
            for t in techs:
                tech_counter[t] += 1

    demonstrated_skills = [
        schemas.DemonstratedSkill(technology=tech, project_count=count)
        for tech, count in tech_counter.most_common()
    ]

    return schemas.UserPublicProfile(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        department=user.department,
        bio=user.bio,
        created_at=user.created_at,
        projects_count=len(user_projects),
        demonstrated_skills=demonstrated_skills
    )

@router.get("/{user_id}/projects", response_model=List[schemas.ProjectOut])
def get_user_projects(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    
    return db.query(models.Project).filter(models.Project.author_id == user_id).order_by(models.Project.created_at.desc()).all()
