from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    projects_count = db.query(models.Project).filter(models.Project.author_id == current_user.id).count()
    sent_requests_count = db.query(models.HelpRequest).filter(models.HelpRequest.requester_id == current_user.id).count()
    received_requests_count = db.query(models.HelpRequest).filter(models.HelpRequest.recipient_id == current_user.id).count()
    pending_requests_count = db.query(models.HelpRequest).filter(
        models.HelpRequest.recipient_id == current_user.id,
        models.HelpRequest.status == "Pending"
    ).count()

    return schemas.DashboardStats(
        uploaded_projects_count=projects_count,
        sent_requests_count=sent_requests_count,
        received_requests_count=received_requests_count,
        pending_requests_count=pending_requests_count
    )
