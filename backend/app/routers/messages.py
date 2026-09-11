from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Message, StudentRequest, User
from ..schemas import MessageCreate, MessageOut
from ..auth import require_current_user


router = APIRouter(
    prefix="/api/messages",
    tags=["Messages"]
)


# ============================================================
# Helper: Check whether two students are connected
# ============================================================

def are_students_connected(
    current_user_id: int,
    other_user_id: int,
    db: Session
) -> bool:

    connection = (
        db.query(StudentRequest)
        .filter(
            StudentRequest.status == "Accepted",
            (
                (
                    (StudentRequest.sender_id == current_user_id)
                    & (StudentRequest.receiver_id == other_user_id)
                )
                |
                (
                    (StudentRequest.sender_id == other_user_id)
                    & (StudentRequest.receiver_id == current_user_id)
                )
            )
        )
        .first()
    )

    return connection is not None


# ============================================================
# Get conversation with another student
# ============================================================

@router.get(
    "/{user_id}",
    response_model=List[MessageOut]
)
def get_conversation(
    user_id: int,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):

    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot chat with yourself"
        )

    other_user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    if not are_students_connected(
        current_user.id,
        user_id,
        db
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only chat with students whose connection request has been accepted"
        )

    messages = (
        db.query(Message)
        .filter(
            (
                (Message.sender_id == current_user.id)
                & (Message.receiver_id == user_id)
            )
            |
            (
                (Message.sender_id == user_id)
                & (Message.receiver_id == current_user.id)
            )
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages


# ============================================================
# Send a message
# ============================================================

@router.post(
    "",
    response_model=MessageOut,
    status_code=status.HTTP_201_CREATED
)
def send_message(
    data: MessageCreate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):

    if data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send a message to yourself"
        )

    receiver = (
        db.query(User)
        .filter(User.id == data.receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )

    if not data.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    if not are_students_connected(
        current_user.id,
        data.receiver_id,
        db
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only message students whose connection request has been accepted"
        )

    message = Message(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        content=data.content.strip()
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message