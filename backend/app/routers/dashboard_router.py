from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Project, HelpRequest
from ..auth import require_current_user
from ..schemas import ProjectOut, HelpRequestOut

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    my_projects = db.query(Project).filter(
        Project.user_id == current_user.id
    ).count()

    sent_requests = db.query(HelpRequest).filter(
        HelpRequest.user_id == current_user.id
    ).count()

    received_requests = (
        db.query(HelpRequest)
        .join(Project, HelpRequest.project_id == Project.id)
        .filter(Project.user_id == current_user.id)
        .count()
    )

    pending_requests = (
        db.query(HelpRequest)
        .join(Project, HelpRequest.project_id == Project.id)
        .filter(
            Project.user_id == current_user.id,
            HelpRequest.status == "Pending"
        )
        .count()
    )

    return {
        "uploaded_projects_count": my_projects,
        "sent_requests_count": sent_requests,
        "received_requests_count": received_requests,
        "pending_requests_count": pending_requests,
    }


@router.get("/recent-projects", response_model=list[ProjectOut])
def get_recent_projects(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Project)
        .filter(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc())
        .limit(3)
        .all()
    )


@router.get("/request-activity", response_model=list[HelpRequestOut])
def get_request_activity(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    sent = (
        db.query(HelpRequest)
        .filter(HelpRequest.user_id == current_user.id)
        .all()
    )

    received = (
        db.query(HelpRequest)
        .join(Project, HelpRequest.project_id == Project.id)
        .filter(Project.user_id == current_user.id)
        .all()
    )

    combined = sent + received

    unique_requests = {
        request.id: request
        for request in combined
    }

    return sorted(
        unique_requests.values(),
        key=lambda request: request.created_at,
        reverse=True
    )[:5]