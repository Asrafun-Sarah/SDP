from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Component, User
from ..schemas import ComponentCreate, ComponentOut
from ..auth import require_current_user

router = APIRouter(prefix="/api/components", tags=["Component Exchange"])

@router.get("", response_model=List[ComponentOut])
def list_components(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Component)
    if category and category != "All":
        query = query.filter(Component.category == category)
    return query.order_by(Component.created_at.desc()).all()

@router.post("", response_model=ComponentOut, status_code=status.HTTP_201_CREATED)
def create_component(data: ComponentCreate, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    comp = Component(
        name=data.name,
        category=data.category,
        quantity=data.quantity,
        condition=data.condition or "Good",
        contact=data.contact,
        user_id=current_user.id
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp

@router.patch("/{component_id}/claim", response_model=ComponentOut)
def claim_component(component_id: int, current_user: User = Depends(require_current_user), db: Session = Depends(get_db)):
    comp = db.query(Component).filter(Component.id == component_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")
    comp.status = "Claimed" if comp.status == "Available" else "Available"
    db.commit()
    db.refresh(comp)
    return comp
