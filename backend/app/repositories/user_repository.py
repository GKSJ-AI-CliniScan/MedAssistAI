from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, full_name: str, email: str, password: str, role: str = "patient") -> User:
        user = User(
            full_name=full_name,
            email=email,
            hashed_password=get_password_hash(password),
            role=role,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_active(self, user: User, is_active: bool) -> User:
        user.is_active = is_active
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_password(self, user: User, new_password: str) -> User:
        user.hashed_password = get_password_hash(new_password)
        self.db.commit()
        self.db.refresh(user)
        return user

    def count(self) -> int:
        return self.db.query(User).count()

    def count_by_role(self, role: str) -> int:
        return self.db.query(User).filter(User.role == role).count()
