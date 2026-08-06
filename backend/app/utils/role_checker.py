from typing import List
from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.utils.auth_handler import get_current_user


def require_role(required_role: str):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.lower() != required_role.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires '{required_role}' role.",
            )
        return current_user

    return role_checker


def require_roles(*allowed_roles: str):
    def roles_checker(current_user: User = Depends(get_current_user)) -> User:
        allowed = {r.lower() for r in allowed_roles}
        if current_user.role.lower() not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}",
            )
        return current_user

    return roles_checker