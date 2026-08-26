from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import HelpRequest, User
from ..schemas import HelpRequestCreate, HelpRequestOut
from ..auth import require_current_user

router = APIRouter(prefix="/api/help-requests", tags=["Help Requests"])

@router.get("", response_model=List[HelpRequestOut])
def list_help_requests(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(HelpRequest)
    if category and category != "All":
        query = query.filter(HelpRequest.category == category)
    return query.order_by(HelpRequest.created_at.desc()).all()

@router.post("", response_model=HelpRequestOut, status_code=status.HTTP_201_CREATED)
def create_help_request(data: HelpRequestCreate, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    req = HelpRequest(
        title=data.title,
        description=data.description,
        category=data.category or "Circuit Design",
        project_id=data.project_id,
        user_id=current_user.id,
        status="Pending"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.post("/{request_id}/accept", response_model=HelpRequestOut)
def accept_help_request(request_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    req = db.query(HelpRequest).filter(HelpRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Help request not found")
    req.status = "Accepted"
    req.helper_id = current_user.id
    db.commit()
    db.refresh(req)
    return req

@router.post("/{request_id}/decline", response_model=HelpRequestOut)
def decline_help_request(request_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    req = db.query(HelpRequest).filter(HelpRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Help request not found")
    req.status = "Declined"
    db.commit()
    db.refresh(req)
    return req
