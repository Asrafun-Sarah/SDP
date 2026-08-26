from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import (
    UserCreate,
    UserLogin,
    UserOut,
    UserUpdate,
    Token,
)
from ..auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    require_current_user,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Auth & Student Profile"]
)


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # Hash password
    hashed_password = get_password_hash(
        user_data.password
    )

    # Create user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        department=(
            user_data.department
            or "Electrical & Computer Engineering"
        ),
        bio=(
            user_data.bio
            or "Engineering student passionate about building real-world projects."
        ),
        demonstrated_skills=(
            user_data.demonstrated_skills
            or "C++, Python, Arduino, Circuit Design"
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT
    access_token = create_access_token(
        data={"sub": new_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post(
    "/login",
    response_model=Token
)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):

    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    # User doesn't exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Check password
    if not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # Generate JWT
    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get(
    "/me",
    response_model=Optional[UserOut]
)
def get_me(
    current_user: Optional[User] = Depends(
        get_current_user
    )
):
    return current_user


@router.put(
    "/profile",
    response_model=UserOut
)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(
        require_current_user
    ),
    db: Session = Depends(get_db)
):

    if data.name:
        current_user.name = data.name

    if data.department:
        current_user.department = data.department

    if data.bio is not None:
        current_user.bio = data.bio

    if data.demonstrated_skills is not None:
        current_user.demonstrated_skills = (
            data.demonstrated_skills
        )

    db.commit()
    db.refresh(current_user)

    return current_user


@router.get(
    "/profile/{user_id}",
    response_model=UserOut
)
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found"
        )

    return user
