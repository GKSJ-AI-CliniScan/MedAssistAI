"""
Notifications Router
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.repositories import NotificationRepository
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[dict])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = NotificationRepository(db)
    notifs = repo.get_by_user(current_user.id)
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "read": n.read,
            "created_at": n.created_at.isoformat(),
        }
        for n in notifs
    ]


@router.get("/unread-count", response_model=dict)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = NotificationRepository(db)
    return {"count": repo.count_unread(current_user.id)}


@router.put("/{notification_id}/read", response_model=dict)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = NotificationRepository(db)
    success = repo.mark_read(notification_id, current_user.id)
    return {"success": success}


@router.put("/mark-all-read", response_model=dict)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = NotificationRepository(db)
    updated = repo.mark_all_read(current_user.id)
    return {"updated": updated}
