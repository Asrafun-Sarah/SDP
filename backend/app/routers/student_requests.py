from ..schemas import UserOut, StudentRequestCreate, StudentRequestOut
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import StudentRequest, User
from ..schemas import StudentRequestCreate, StudentRequestOut
from ..auth import require_current_user


router = APIRouter(
    prefix="/api/student-requests",
    tags=["Student Requests"]
)


# Search students by name
@router.get("/search", response_model=List[UserOut])
def search_students(
    name: str,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    students = (
        db.query(User)
        .filter(
            User.name.ilike(f"%{name}%"),
            User.id != current_user.id
        )
        .order_by(User.name.asc())
        .all()
    )

    return students


# Send a student request
@router.post(
    "",
    response_model=StudentRequestOut,
    status_code=status.HTTP_201_CREATED
)
def send_student_request(
    data: StudentRequestCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send a request to yourself"
        )

    receiver = (
        db.query(User)
        .filter(User.id == data.receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_request = (
        db.query(StudentRequest)
        .filter(
            StudentRequest.sender_id == current_user.id,
            StudentRequest.receiver_id == data.receiver_id,
            StudentRequest.status == "Pending"
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=400,
            detail="You already have a pending request to this student"
        )

    request = StudentRequest(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        message=data.message,
        status="Pending"
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    return request


# View requests received by current user
@router.get(
    "/received",
    response_model=List[StudentRequestOut]
)
def received_student_requests(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(StudentRequest)
        .filter(StudentRequest.receiver_id == current_user.id)
        .order_by(StudentRequest.created_at.desc())
        .all()
    )


# View requests sent by current user
@router.get(
    "/sent",
    response_model=List[StudentRequestOut]
)
def sent_student_requests(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(StudentRequest)
        .filter(StudentRequest.sender_id == current_user.id)
        .order_by(StudentRequest.created_at.desc())
        .all()
    )


# Accept a student request
@router.post(
    "/{request_id}/accept",
    response_model=StudentRequestOut
)
def accept_student_request(
    request_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    request = (
        db.query(StudentRequest)
        .filter(StudentRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Student request not found"
        )

    if request.receiver_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot accept this request"
        )

    if request.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="This request has already been processed"
        )

    request.status = "Accepted"

    db.commit()
    db.refresh(request)

    return request


# Decline a student request
@router.post(
    "/{request_id}/decline",
    response_model=StudentRequestOut
)
def decline_student_request(
    request_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    request = (
        db.query(StudentRequest)
        .filter(StudentRequest.id == request_id)
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Student request not found"
        )

    if request.receiver_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot decline this request"
        )

    if request.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="This request has already been processed"
        )

    request.status = "Declined"

    db.commit()
    db.refresh(request)

    return request