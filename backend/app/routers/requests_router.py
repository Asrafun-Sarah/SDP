from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/requests", tags=["Help Requests"])

@router.post("", response_model=schemas.HelpRequestOut, status_code=status.HTTP_201_CREATED)
def create_help_request(
    request_data: schemas.HelpRequestCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == request_data.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target project not found")

    if project.author_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot send a help request to yourself on your own project.")

    new_request = models.HelpRequest(
        project_id=project.id,
        requester_id=current_user.id,
        recipient_id=project.author_id,
        message=request_data.message,
        status="Pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # Attach project title for response convenience
    res = schemas.HelpRequestOut.model_validate(new_request)
    res.project_title = project.title
    return res

@router.get("/sent", response_model=List[schemas.HelpRequestOut])
def get_sent_help_requests(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(models.HelpRequest).filter(models.HelpRequest.requester_id == current_user.id).order_by(models.HelpRequest.created_at.desc()).all()
    results = []
    for req in requests:
        res = schemas.HelpRequestOut.model_validate(req)
        if req.project:
            res.project_title = req.project.title
        results.append(res)
    return results

@router.get("/received", response_model=List[schemas.HelpRequestOut])
def get_received_help_requests(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(models.HelpRequest).filter(models.HelpRequest.recipient_id == current_user.id).order_by(models.HelpRequest.created_at.desc()).all()
    results = []
    for req in requests:
        res = schemas.HelpRequestOut.model_validate(req)
        if req.project:
            res.project_title = req.project.title
        results.append(res)
    return results

@router.patch("/{request_id}/status", response_model=schemas.HelpRequestOut)
def update_help_request_status(
    request_id: int,
    status_update: schemas.HelpRequestStatusUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if status_update.status not in ["Accepted", "Declined"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status must be 'Accepted' or 'Declined'")

    help_req = db.query(models.HelpRequest).filter(models.HelpRequest.id == request_id).first()
    if not help_req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Help request not found")

    if help_req.recipient_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to respond to this help request.")

    help_req.status = status_update.status
    db.commit()
    db.refresh(help_req)

    res = schemas.HelpRequestOut.model_validate(help_req)
    if help_req.project:
        res.project_title = help_req.project.title
    return res
