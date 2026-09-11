from typing import List
from collections import Counter

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get(
    "/{user_id}",
    response_model=schemas.UserPublicProfile
)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    user_projects = (
        db.query(models.Project)
        .filter(models.Project.user_id == user_id)
        .order_by(models.Project.created_at.desc())
        .all()
    )

    # Calculate demonstrated experience
    tech_counter = Counter()

    for project in user_projects:
        if project.tech_stack:
            technologies = [
                tech.strip()
                for tech in project.tech_stack.split(",")
                if tech.strip()
            ]

            for technology in technologies:
                tech_counter[technology] += 1

    demonstrated_skills = [
        schemas.DemonstratedSkill(
            technology=technology,
            project_count=count
        )
        for technology, count in tech_counter.most_common()
    ]

    return schemas.UserPublicProfile(
        id=user.id,
        full_name=user.name,
        email=user.email,
        department=user.department,
        bio=user.bio,
        created_at=user.created_at,
        projects_count=len(user_projects),
        demonstrated_skills=demonstrated_skills
    )


@router.get(
    "/{user_id}/projects",
    response_model=List[schemas.ProjectOut]
)
def get_user_projects(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    return (
        db.query(models.Project)
        .filter(models.Project.user_id == user_id)
        .order_by(models.Project.created_at.desc())
        .all()
    )