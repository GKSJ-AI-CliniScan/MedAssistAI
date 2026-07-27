from typing import List
from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: int, limit: int = 50) -> List[Notification]:
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )

    def create(self, user_id: int, title: str, message: str, type: str = "info") -> Notification:
        notif = Notification(user_id=user_id, title=title, message=message, type=type)
        self.db.add(notif)
        self.db.commit()
        self.db.refresh(notif)
        return notif

    def mark_read(self, notification_id: int, user_id: int) -> bool:
        notif = self.db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).first()
        if notif:
            notif.read = True
            self.db.commit()
            return True
        return False

    def mark_all_read(self, user_id: int) -> int:
        updated = (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.read == False)
            .update({"read": True})
        )
        self.db.commit()
        return updated

    def count_unread(self, user_id: int) -> int:
        return self.db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.read == False
        ).count()
