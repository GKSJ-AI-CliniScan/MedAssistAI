"""
Notification Service

Business logic for creating, delivering, and managing in-app
notifications for users across the platform.
"""
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.notification_repository import NotificationRepository
from app.models.user import User

logger = logging.getLogger(__name__)


class NotificationService:
    """Handles notification lifecycle: creation, delivery, and read status."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = NotificationRepository(db)

    def notify_user(
        self,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "info",
        link: Optional[str] = None,
    ):
        """
        Create an in-app notification for a user.

        Args:
            user_id: Target user's ID.
            title: Short notification title.
            message: Full notification message.
            notification_type: Category (info, warning, success, appointment, report).
            link: Optional deep-link to a related resource.
        """
        try:
            full_message = message
            if link:
                full_message = f"{message} [View]({link})"
            self.repo.create(
                user_id=user_id,
                title=title,
                message=full_message,
                type=notification_type,
            )
            logger.info("Notification created for user %d: %s", user_id, title)
        except Exception as exc:
            logger.error(
                "Failed to create notification for user %d: %s", user_id, exc
            )

    def notify_appointment_booked(
        self, patient_user_id: int, doctor_name: str, date_time: str
    ):
        """Notify a patient about a confirmed appointment."""
        self.notify_user(
            user_id=patient_user_id,
            title="Appointment Confirmed",
            message=f"Your appointment with Dr. {doctor_name} on {date_time} has been confirmed.",
            notification_type="appointment",
            link="/appointments",
        )

    def notify_report_ready(self, patient_user_id: int, report_id: int):
        """Notify a patient that their medical report is ready."""
        self.notify_user(
            user_id=patient_user_id,
            title="Medical Report Ready",
            message=f"Your medical report #{report_id} is ready for download.",
            notification_type="report",
            link="/reports",
        )

    def notify_prediction_complete(self, patient_user_id: int, prediction_id: int):
        """Notify a patient that their prediction analysis is complete."""
        self.notify_user(
            user_id=patient_user_id,
            title="Prediction Analysis Complete",
            message=f"Your symptom analysis #{prediction_id} is ready. View your results.",
            notification_type="success",
            link="/predictions",
        )

    def get_user_notifications(self, user_id: int):
        """Retrieve notifications for a user."""
        return self.repo.get_by_user(user_id)

    def mark_read(self, notification_id: int, user_id: int) -> bool:
        """Mark a single notification as read."""
        return self.repo.mark_read(notification_id, user_id)

    def mark_all_read(self, user_id: int) -> int:
        """Mark all of a user's notifications as read. Returns count updated."""
        return self.repo.mark_all_read(user_id)
