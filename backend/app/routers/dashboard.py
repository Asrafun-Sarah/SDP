from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Project, HelpRequest, User, StudentRequest
from ..auth import require_current_user


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    uploaded_projects_count = (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .count()
    )

    sent_requests_count = (
        db.query(StudentRequest)
        .filter(StudentRequest.sender_id == current_user.id)
        .count()
    )

    received_requests_count = (
        db.query(StudentRequest)
        .filter(StudentRequest.receiver_id == current_user.id)
        .count()
    )

    pending_requests_count = (
        db.query(StudentRequest)
        .filter(
            StudentRequest.receiver_id == current_user.id,
            StudentRequest.status == "Pending"
        )
        .count()
    )

    return {
        "uploaded_projects_count": uploaded_projects_count,
        "sent_requests_count": sent_requests_count,
        "received_requests_count": received_requests_count,
        "pending_requests_count": pending_requests_count,
    }


@router.get("/recent-projects")
def recent_projects(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc())
        .limit(5)
        .all()
    )


@router.get("/request-activity")
def request_activity(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    # Existing project-help requests
    sent_help_requests = (
        db.query(HelpRequest)
        .filter(HelpRequest.user_id == current_user.id)
        .all()
    )

    received_help_requests = (
        db.query(HelpRequest)
        .filter(HelpRequest.helper_id == current_user.id)
        .all()
    )

    help_requests = sent_help_requests + received_help_requests

    # Student-to-student connection requests
    student_requests = (
        db.query(StudentRequest)
        .filter(
            (
                StudentRequest.sender_id == current_user.id
            )
            |
            (
                StudentRequest.receiver_id == current_user.id
            )
        )
        .all()
    )

    activities = []

    # Keep existing HelpRequest dashboard activity
    for request in help_requests:
        activities.append({
            "type": "help_request",
            "id": request.id,
            "title": request.title,
            "description": request.description,
            "category": request.category,
            "status": request.status,
            "project_id": request.project_id,
            "user_id": request.user_id,
            "helper_id": request.helper_id,
            "created_at": request.created_at,
        })

    # Add StudentRequest activity
    for request in student_requests:

        if request.sender_id == current_user.id:
            other_student = request.receiver
            direction = "sent"
        else:
            other_student = request.sender
            direction = "received"

        activities.append({
            "type": "student_request",
            "id": request.id,
            "title": f"Connection with {other_student.name}",
            "description": request.message,
            "category": "Student Connection",
            "status": request.status,
            "project_id": None,
            "user_id": request.sender_id,
            "helper_id": request.receiver_id,
            "created_at": request.created_at,
            "sender_id": request.sender_id,
            "receiver_id": request.receiver_id,
            "other_student_id": other_student.id,
            "other_student_name": other_student.name,
            "direction": direction,
        })

    return sorted(
        activities,
        key=lambda activity: activity["created_at"],
        reverse=True
    )[:10]